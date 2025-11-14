import { Body, Controller, Get, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/entities/user.entity';
import { FilesQueryDto } from './dto/files-query.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { log } from 'console';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { VerificationGuard } from 'src/core/guard/verification.guard';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseGuards(AuthGuard, VerificationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 209715200 }),]
    })
  ) file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @Req() request,
  ) {
    log({ dto })
    const data = await this.filesService.uploadFile(
      file,
      dto,
      request.user as User
    )

    return BaseResponse.makeSuccessResponse(data, null, 'File Uploaded Successfully', HttpStatus.CREATED)
  }

  /**
   * Get all files uploaded by a particular user in a folder (with pagination, sorting, filtering, and access control)
   */
  @Get()
  @UseGuards(AuthGuard)
  async getFiles(
    @Query() query: FilesQueryDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.filesService.getFilesInFolderForUser(query, user);
    return BaseResponse.makeSuccessResponse(result.data, result.meta, 'Files fetched successfully', HttpStatus.OK);
  }
}

