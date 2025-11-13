import { AccountStatus, UserRoles } from '../user.enums';
import { Folder } from 'src/folders/entities/folder.entity';
export declare class User {
    id?: string;
    creatorId?: string;
    email: string;
    fullName: string;
    status: AccountStatus;
    passwordHash?: string;
    tempPasswordHash: string;
    previousPasswords?: string[];
    folders?: Folder[];
    role: UserRoles;
    createdAt?: Date;
}
