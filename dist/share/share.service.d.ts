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
import { SafeUserDTO } from './dto/safe-user.dto';
export declare class ShareService {
    private readonly shareRepo;
    private readonly userRepo;
    private readonly teamRepo;
    private readonly fileRepo;
    private readonly folderRepo;
    private readonly notificationService;
    constructor(shareRepo: ShareRepository, userRepo: UserRepository, teamRepo: TeamRepository, fileRepo: FileRepository, folderRepo: FolderRepository, notificationService: NotificationService);
    share(sharedBy: User, dto: ShareCreateDTO): Promise<Share>;
    revoke(sharedBy: User, dto: ShareRevokeDTO): Promise<void>;
    getFileOrFolderShares(fileId?: string, folderId?: string): Promise<{
        users: SafeUserDTO[];
        teams: Team[];
    }>;
    private validateFileOrFolder;
    private fetchShares;
    private extractRecipients;
    private mapSafeUsers;
}
