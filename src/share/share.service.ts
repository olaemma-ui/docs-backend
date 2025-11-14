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
     * Share a file or folder with users and/or teams.
     * 
     * **Steps:**
     * 1. Validate that the target file or folder exists.
     * 2. Ensure only the owner can share it.
     * 3. Resolve user recipients by email.
     * 4. Resolve team recipients and expand to their members.
     * 5. Remove duplicate users.
     * 6. Persist a new Share entity in the database.
     * 7. Send email notifications to all recipients.
     * 
     * Additionally:
     * - Avoids duplicate shares if already shared.
     * - Ensures that when sharing with a team, any user previously shared individually
     *   will reference their existing share instead of creating a new one.
     * 
     * @param sharedBy - The user performing the share.
     * @param dto - The `ShareCreateDTO` containing IDs and metadata.
     * @returns The saved `Share` entity.
     * @throws {ForbiddenException} If the current user is not the owner.
     * @throws {NotFoundException} If the file/folder or users/teams do not exist.
     */
    async share(sharedBy: User, dto: ShareCreateDTO): Promise<Share> {
        // 1️⃣ Validate file/folder existence
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file) throw new NotFoundException('File not found');

        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder) throw new NotFoundException('Folder not found');

        // 2️⃣ Check ownership
        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new ForbiddenException(`You don't have permission to share this ${file ? 'File' : 'Folder'}`);
        }

        // 3️⃣ Resolve users
        let users: User[] = [];
        if (dto.emails?.length) {
            const foundUsers = await this.userRepo.findByEmails(dto.emails);
            if (!foundUsers.length) throw new NotFoundException('No users found for the provided IDs');
            users.push(...foundUsers);
        }

        // 4️⃣ Resolve teams and expand members
        let teams: Team[] = [];
        if (dto.teamIds?.length) {
            const foundTeams = await this.teamRepo.findByIds(dto.teamIds);
            if (!foundTeams.length) throw new NotFoundException('No teams found for the provided IDs');
            teams.push(...foundTeams);

            for (const team of foundTeams) {
                users.push(...(team.members ?? []).map(m => m.user));
            }
        }

        // 5️⃣ Remove duplicate users
        users = Array.from(new Map(users.map(u => [u.id, u])).values());

        // 6️⃣ Check if a Share already exists for this file/folder
        let share: Share | null = await this.shareRepo.findOne(
            { file: file ?? undefined, folder: folder ?? undefined },
            ['sharedWithUsers', 'sharedWithTeams'],
        );

        if (share) {
            // Merge new users
            const existingUserIds = new Set(share.sharedWithUsers.map(u => u.id));
            share.sharedWithUsers.push(...users.filter(u => !existingUserIds.has(u.id)));

            // Merge new teams
            const existingTeamIds = new Set(share.sharedWithTeams.map(t => t.id));
            share.sharedWithTeams.push(...teams.filter(t => !existingTeamIds.has(t.id)));

            share.access = dto.access; // Optionally update access
            share.note = dto.note ?? share.note;

        } else {
            // Create new share
            share = new Share();
            share.sharedBy = sharedBy;
            share.sharedWithUsers = users;
            share.sharedWithTeams = teams;
            share.file = file ?? undefined;
            share.folder = folder ?? undefined;
            share.access = dto.access;
            share.note = dto.note;
        }

        // 7️⃣ Save share
        const savedShare = await this.shareRepo.save([share]);

        // 8️⃣ Send notifications asynchronously
        for (const user of users) {
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
     * Revoke sharing access for specific users, teams, or all recipients
     * of a particular file or folder.
     *
     * **Steps:**
     * 1. Validate file or folder existence.
     * 2. Ensure the action is performed by the owner.
     * 3. Find all relevant share records.
     * 4. Remove specified users and/or teams from the share.
     * 5. Delete share entries that become empty.
     * 6. Save updated share entities.
     * 
     * @param sharedBy - The user performing the revocation.
     * @param dto - The `ShareRevokeDTO` containing file/folder ID and recipient IDs.
     * @throws {ForbiddenException} If not the owner.
     * @throws {NotFoundException} If target entities don't exist.
     */
    async revoke(sharedBy: User, dto: ShareRevokeDTO): Promise<void> {
        const file = dto.fileId ? await this.fileRepo.findById(dto.fileId) : null;
        if (dto.fileId && !file) throw new NotFoundException('File not found');

        const folder = dto.folderId ? await this.folderRepo.findFolderById(dto.folderId) : null;
        if (dto.folderId && !folder) throw new NotFoundException('Folder not found');

        if (folder?.owner?.id !== sharedBy.id && file?.folder.owner !== sharedBy.id) {
            throw new ForbiddenException(`You don't have permission to revoke this ${file ? 'File' : 'Folder'}`);
        }

        const shares = await this.shareRepo.find({
            file: file ?? undefined,
            folder: folder ?? undefined
        });

        for (const share of shares) {
            if (dto.userIds?.length) {
                share.sharedWithUsers = share.sharedWithUsers.filter(u => !(dto.userIds ?? []).includes(u.id!));
            }

            if (dto.teamIds?.length) {
                share.sharedWithTeams = share.sharedWithTeams.filter(t => !(dto.teamIds ?? []).includes(t.id!));
            }

            if ((!share.sharedWithUsers?.length) && (!share.sharedWithTeams?.length)) {
                await this.shareRepo.delete(share);
            } else {
                await this.shareRepo.save([share]);
            }
        }
    }

    /**
     * Get all users and teams with whom a file or folder is shared.
     * 
     * - Filters out users who are already members of shared teams.
     * - Maps users to a `SafeUserDTO` to exclude sensitive data.
     *
     * @param fileId - Optional ID of the file.
     * @param folderId - Optional ID of the folder.
     * @returns An object containing arrays of shared `users` and `teams`.
     * @throws {NotFoundException} If file/folder not found.
     */
    async getFileOrFolderShares(
        fileId?: string,
        folderId?: string
    ): Promise<{ users: SafeUserDTO[]; teams: Team[] }> {
        const { file, folder } = await this.validateFileOrFolder(fileId, folderId);
        const shares = await this.fetchShares(file?.id, folder?.id);
        const { users, teams } = this.extractRecipients(shares);
        return { users: this.mapSafeUsers(users), teams };
    }

    /**
     * Helper method to validate the existence of a file or folder.
     *
     * @param fileId - File ID (optional).
     * @param folderId - Folder ID (optional).
     * @returns Object containing validated `file` and/or `folder`.
     * @throws {NotFoundException} If not found.
     */
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

    /**
     * Fetch all shares linked to a file or folder.
     *
     * @param fileId - Optional file ID.
     * @param folderId - Optional folder ID.
     * @returns Array of `Share` entities.
     */
    private async fetchShares(fileId?: string, folderId?: string): Promise<Share[]> {
        return this.shareRepo.find({
            file: fileId ? { id: fileId } : undefined,
            folder: folderId ? { id: folderId } : undefined,
        });
    }

    /**
     * Extract unique users and teams from a list of shares.
     * 
     * - Avoids duplication.
     * - Excludes users who already belong to shared teams.
     *
     * @param shares - List of Share entities.
     * @returns Object containing unique `users` and `teams`.
     */
    private extractRecipients(shares: Share[]): { users: User[]; teams: Team[] } {
        const teamsMap = new Map<string, Team>();
        const usersMap = new Map<string, User>();

        for (const share of shares) {
            for (const team of share.sharedWithTeams ?? []) {
                teamsMap.set(team.id!, team);
            }
        }

        const teamUserIds = new Set<string>();
        for (const team of teamsMap.values()) {
            for (const member of team.members ?? []) {
                if (member.user?.id) teamUserIds.add(member.user.id);
            }
        }

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

    /**
     * Maps a list of `User` entities to a safe version (`SafeUserDTO`)
     * excluding sensitive information such as password hashes.
     * 
     * @param users - Array of `User` entities.
     * @returns Array of `SafeUserDTO` objects.
     */
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
