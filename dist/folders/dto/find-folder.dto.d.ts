export declare class FindFolderDto {
    search?: string;
    parentId?: string | null;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: 'createdAt' | 'name';
    sortOrder?: 'ASC' | 'DESC';
}
