export declare class FilesQueryDto {
    folderId: string;
    uploaderId?: string;
    pageNumber: number;
    pageSize: number;
    sortBy?: 'createdAt' | 'name' | 'size';
    sortOrder?: 'ASC' | 'DESC';
    keyWord?: string;
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
    dateFrom?: string;
    dateTo?: string;
}
