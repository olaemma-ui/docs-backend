import { ShareAccess } from '../enums/share-access.enum';
export declare class ShareCreateDTO {
    fileId?: string;
    folderId?: string;
    emails?: string[];
    teamIds?: string[];
    access: ShareAccess;
    note?: string;
}
