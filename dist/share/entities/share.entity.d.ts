import { User } from 'src/user/entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Folder } from 'src/folders/entities/folder.entity';
import { ShareAccess } from '../enums/share-access.enum';
import { Team } from 'src/team/entities/team.entity';
export declare class Share {
    id: string;
    sharedBy: User;
    sharedWithUsers: User[];
    sharedWithTeams: Team[];
    file?: FileEntity;
    folder?: Folder;
    access: ShareAccess;
    note?: string;
    sharedAt: Date;
}
