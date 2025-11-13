import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";
export declare class FileEntity {
    id?: string;
    name: string;
    key: string;
    url: string;
    size?: number;
    mimeType?: string;
    version?: number;
    versionId?: string;
    folder: Folder;
    uploader: User;
    createdAt?: Date;
    updatedAt?: Date;
}
