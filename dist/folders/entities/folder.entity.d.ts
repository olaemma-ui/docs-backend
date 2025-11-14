import { FileEntity } from "src/files/entities/file.entity";
import { User } from "src/user/entities/user.entity";
import { Share } from "src/share/entities/share.entity";
export declare class Folder {
    id?: string;
    name: string;
    owner?: User;
    parent?: Folder;
    files?: Promise<FileEntity[]>;
    shares?: Share[];
    createdAt?: Date;
    updatedAt?: Date;
}
