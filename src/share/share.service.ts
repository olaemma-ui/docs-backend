import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { ShareRepository } from './repository/share.repo-impl';
import { FileRepository } from 'src/files/repository/file.repo-impl';
import { FolderRepository } from 'src/folders/repository/folder.repo-impl';
import { TeamRepository } from 'src/team/repository/team.repo-impl';
import { UserRepository } from 'src/user/repository/user-repo-impl';
import { ShareCreateDTO } from './dto/share-create.dto';
import { ShareRevokeDTO } from './dto/share-revoke.dto';
import { Share } from './entities/share.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Folder } from 'src/folders/entities/folder.entity';
import { SafeUserDTO } from './dto/safe-user.dto';

@Injectable()
export class ShareService {
    constructor(
        private readonly shareRepo: ShareRepository,
        private readonly userRepo: UserRepository,
        private readonly teamRepo: TeamRepository,
        private readonly fileRepo: FileRepository,
        private readonly folderRepo: FolderRepository,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Share a file or folder with multiple users and/or teams.
     *
     * Steps:
     * 1. Validate that the target file/folder exists.
     * 2. Check ownership: only owners can share.
     * 3. Resolve all target users from IDs.
     * 4. Resolve all target teams and expand their members as recipients.
     * 5. Remove duplicate users.
     * 6. Create a Share entity and persist it.
     * 7. Send notifications asynchronously to users.
     *
     * @param sharedBy - The user performing the share.
     * @param dto - DTO containing fileId/folderId, userIds, teamIds, access, and note.
     * @returns The saved Share entity.
     */
    async share(sharedBy: User, dto: ShareCreateDTO): Promise<Share> {
        // --------------------------
        // 1. Validate file/folder exists
        // --------------------------
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file) throw new NotFoundException('File not found');

        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder) throw new NotFoundException('Folder not found');

        // --------------------------
        // 2. Check ownership
        // --------------------------
        // Only the owner of the file/folder can share
        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new ForbiddenException(`You don't have permission to share this ${file ? 'File' : 'Folder'}`);
        }

        // --------------------------
        // 3. Resolve users
        // --------------------------
        const users: User[] = [];
        if (dto.emails?.length) {
            const foundUsers = await this.userRepo.findByEmails(dto.emails);
            if (!foundUsers.length) throw new NotFoundException('No users found for the provided IDs');
            users.push(...foundUsers);
        }

        // --------------------------
        // 4. Resolve teams and expand members
        // --------------------------
        const teams: Team[] = [];
        if (dto.teamIds?.length) {
            const foundTeams = await this.teamRepo.findByIds(dto.teamIds);
            if (!foundTeams.length) throw new NotFoundException('No teams found for the provided IDs');
            teams.push(...foundTeams);

            // Add all team members as recipients
            for (const team of foundTeams) {
                users.push(...(team.members ?? []).map(m => m.user));
            }
        }

        // --------------------------
        // 5. Remove duplicate users
        // --------------------------
        const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());

        // --------------------------
        // 6. Create and persist Share entity
        // --------------------------
        const share = new Share();
        share.sharedBy = sharedBy;
        share.sharedWithUsers = uniqueUsers;
        share.sharedWithTeams = teams;
        share.file = file ?? undefined;
        share.folder = folder ?? undefined;
        share.access = dto.access;
        share.note = dto.note;

        const savedShare = await this.shareRepo.save([share]);

        // --------------------------
        // 7. Send notifications asynchronously
        // --------------------------
        for (const user of uniqueUsers) {
            if (file) {
                this.notificationService.sendFolderOrFileSharedMail(
                    user.email,
                    user.fullName,
                    sharedBy.fullName,
                    file.name,
                    'File',
                    ''
                );
            } else if (folder) {
                this.notificationService.sendFolderOrFileSharedMail(
                    user.email,
                    user.fullName,
                    sharedBy.fullName,
                    folder.name,
                    'Folder',
                    ''
                );
            }
        }

        return savedShare[0];
    }

    /**
     * Revoke sharing for specific users, teams, or all.
     *
     * Steps:
     * 1. Validate that the target file/folder exists.
     * 2. Check ownership: only owners can revoke shares.
     * 3. Find all Share entities matching the file/folder.
     * 4. Remove users and/or teams from each Share entity.
     * 5. Delete Share entities with no remaining recipients.
     * 6. Update remaining Share entities.
     *
     * @param sharedBy - The user performing the revocation.
     * @param dto - DTO containing fileId/folderId, userIds, teamIds.
     */
    async revoke(sharedBy: User, dto: ShareRevokeDTO): Promise<void> {
        // --------------------------
        // 1. Validate file/folder exists
        // --------------------------
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file) throw new NotFoundException('File not found');

        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder) throw new NotFoundException('Folder not found');

        // --------------------------
        // 2. Check ownership
        // --------------------------
        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new ForbiddenException(`You don't have permission to revoke this ${file ? 'File' : 'Folder'}`);
        }

        // --------------------------
        // 3. Fetch all relevant shares
        // --------------------------
        const shares = await this.shareRepo.find({
            file: file ?? undefined,
            folder: folder ?? undefined
        });

        // --------------------------
        // 4. Remove recipients from shares
        // --------------------------
        for (const share of shares) {
            // Remove specific users
            if (dto.userIds?.length) {
                share.sharedWithUsers = share.sharedWithUsers.filter(u => !(dto.userIds ?? []).includes(u.id!));
            }

            // Remove specific teams
            if (dto.teamIds?.length) {
                share.sharedWithTeams = share.sharedWithTeams.filter(t => !(dto.teamIds ?? []).includes(t.id!));
            }

            // --------------------------
            // 5 & 6. Delete or update Share
            // --------------------------
            if ((!share.sharedWithUsers || !share.sharedWithUsers.length) &&
                (!share.sharedWithTeams || !share.sharedWithTeams.length)) {
                await this.shareRepo.delete(share);
            } else {
                await this.shareRepo.save([share]);
            }
        }
    }

    // --------------------------
    // Public API: Get all shares for a file/folder
    // Returns users (SafeUserDTO) and teams
    // --------------------------
    async getFileOrFolderShares(
        fileId?: string,
        folderId?: string
    ): Promise<{ users: SafeUserDTO[]; teams: Team[] }> {
        const { file, folder } = await this.validateFileOrFolder(fileId, folderId); // Validate existence
        const shares = await this.fetchShares(file?.id, folder?.id); // Fetch all shares
        const { users, teams } = this.extractRecipients(shares); // Extract unique users/teams
        return { users: this.mapSafeUsers(users), teams }; // Map users to safe DTO
    }

    // --------------------------
    // Private helper: Validate file/folder existence
    // Throws NotFoundException if not found
    // --------------------------
    private async validateFileOrFolder(fileId?: string, folderId?: string) {
        let file: FileEntity | null = null;
        let folder: Folder | null = null;

        if (fileId) {
            file = await this.fileRepo.findById(fileId);
            if (!file) throw new NotFoundException('File not found');
        }

        if (folderId) {
            folder = await this.folderRepo.findFolderById(folderId);
            if (!folder) throw new NotFoundException('Folder not found');
        }

        return { file, folder };
    }

    // --------------------------
    // Private helper: Fetch all shares matching file/folder
    // --------------------------
    private async fetchShares(fileId?: string, folderId?: string): Promise<Share[]> {
        return this.shareRepo.find({
            file: fileId ? { id: fileId } : undefined,
            folder: folderId ? { id: folderId } : undefined,
        });
    }

    // --------------------------
    // Private helper: Extract unique users and teams
    // Excludes users that are members of shared teams
    // --------------------------
    private extractRecipients(shares: Share[]): { users: User[]; teams: Team[] } {
        const teamsMap = new Map<string, Team>();
        const usersMap = new Map<string, User>();

        // Collect teams
        for (const share of shares) {
            for (const team of share.sharedWithTeams ?? []) {
                teamsMap.set(team.id!, team);
            }
        }

        // Collect all user IDs that belong to teams
        const teamUserIds = new Set<string>();
        for (const team of teamsMap.values()) {
            for (const member of team.members ?? []) {
                if (member.user?.id) teamUserIds.add(member.user.id);
            }
        }

        // Collect individual users who are not in any team
        for (const share of shares) {
            for (const user of share.sharedWithUsers ?? []) {
                if (!teamUserIds.has(user.id!)) {
                    usersMap.set(user.id!, user);
                }
            }
        }

        return {
            users: Array.from(usersMap.values()),
            teams: Array.from(teamsMap.values()),
        };
    }

    // --------------------------
    // Private helper: Map users to safe DTO
    // Ensures sensitive info like passwordHash is never returned
    // --------------------------
    private mapSafeUsers(users: User[]): SafeUserDTO[] {
        return users.map(u => ({
            id: u.id!,
            email: u.email,
            fullName: u.fullName,
            status: u.status,
            role: u.role,
            createdAt: u.createdAt,
        }));
    }
}
