import { FileEntity } from "src/files/entities/file.entity";
import { User } from "src/user/entities/user.entity";
export declare class Folder {
    id?: string;
    name: string;
    owner?: User;
    parent?: Folder;
    files?: Promise<FileEntity[]>;
    createdAt?: Date;
    updatedAt?: Date;
}
