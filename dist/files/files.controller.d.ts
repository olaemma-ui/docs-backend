import { FilesService } from './files.service';
import { User } from 'src/user/entities/user.entity';
import { FilesQueryDto } from './dto/files-query.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { UploadFileDto } from './dto/upload-file.dto';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, dto: UploadFileDto, request: any): Promise<BaseResponse<import("./entities/file.entity").FileEntity>>;
    getFiles(query: FilesQueryDto, user: User): Promise<BaseResponse<import("./entities/file.entity").FileEntity[]>>;
}
