import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FindFolderDto } from './dto/find-folder.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { Folder } from './entities/folder.entity';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';

@Controller('folders')
@UseGuards(AuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) { }

  /**
   * Create a new folder for the current user
   */
  @Post('create')
  async create(
    @Body() createFolderDto: CreateFolderDto,
    @Req() request: Record<string, any>,
  ): Promise<BaseResponse<Folder>> {
    const user: UserEntity = request.user;
    const data = await this.foldersService.create(createFolderDto, user.id ?? '');
    return BaseResponse.makeSuccessResponse<Folder>(data, null, 'Folder created successfully.');
  }

  /**
   * Fetch all folders (admin only)
   */
  @Get()
  async findAll(
    @Query() dto: FindFolderDto,
    @CurrentUser() user: UserEntity
  ): Promise<
    BaseResponse<{
      data: Folder[];
      total: number;
      currentPage: number;
      totalPages: number;
    }>
  > {
    const data = await this.foldersService.findAllFolder(user.id ?? '', dto);
    return BaseResponse.makeSuccessResponse(data, null, 'All folders fetched successfully.');
  }

  /**
   * Fetch folders belonging to the current user
   */
  @Get('me')
  async findUserFolders(
    @Query() dto: FindFolderDto,
    @CurrentUser() user: UserEntity
  ): Promise<BaseResponse<Folder[]>> {
    const data = await this.foldersService.findUserFolders(user.id ?? '', dto);
    return BaseResponse.makeSuccessResponse(data.data, data.meta, 'User folders fetched successfully.');
  }

  /**
   * Rename a folder
   */
  @Patch('rename')
  async renameFolder(
    @Body() dto: UpdateFolderDto,
    @Req() request: Record<string, any>,
    @Query("folderId") folderId: string
  ): Promise<BaseResponse<Folder>> {
    const user: UserEntity = request.user;
    const data = await this.foldersService.renameFolder(dto, user.id ?? '', folderId);
    return BaseResponse.makeSuccessResponse(data, null, 'Folder renamed successfully.');
  }

  /**
   * Delete a folder (optional if implemented later)
   */
  @Delete(':id')
  async deleteFolder(
    @Param('id') id: string,
    @Req() request: Record<string, any>,
    @Req() user: UserEntity,
  ): Promise<BaseResponse<string>> {
    // Implement delete logic later in service
    return BaseResponse.makeSuccessResponse(id, null, 'Folder deleted successfully.');
  }

  // /**
  //  * Create a folder share
  //  */
  // @Post(':id/shares')
  // async createShare(
  //   @Param('id') folderId: string,
  //   @Body() dto: CreateFolderShareDto,
  //   @Req() request: Record<string, any>,
  // ): Promise<BaseResponse<FolderShareResponseDto>> {
  //   const user: UserEntity = request.user;
  //   const data = await this.foldersService.createShare(folderId, dto, user.id ?? '');
  //   return BaseResponse.makeSuccessResponse<FolderShareResponseDto>(data, null, 'Folder shared successfully.');
  // }

  // /**
  //  * List shares for a folder
  //  */
  // @Get(':id/shares')
  // async listShares(
  //   @Param('id') folderId: string,
  //   @Req() request: Record<string, any>,
  // ): Promise<BaseResponse<FolderShareResponseDto[]>> {
  //   const user: UserEntity = request.user;
  //   const data = await this.foldersService.listShares(folderId, user.id ?? '');
  //   return BaseResponse.makeSuccessResponse<FolderShareResponseDto[]>(data, null, 'Folder shares fetched successfully.');
  // }

  // /**
  //  * Update a folder share
  //  */
  // @Patch(':id/shares/:shareId')
  // async updateShare(
  //   @Param('id') folderId: string,
  //   @Param('shareId') shareId: string,
  //   @Body() dto: UpdateFolderShareDto,
  //   @Req() request: Record<string, any>,
  // ): Promise<BaseResponse<FolderShareResponseDto>> {
  //   const user: UserEntity = request.user;
  //   const data = await this.foldersService.updateShare(folderId, shareId, dto, user.id ?? '');
  //   return BaseResponse.makeSuccessResponse<FolderShareResponseDto>(data, null, 'Folder share updated successfully.');
  // }

  // /**
  //  * Revoke a folder share
  //  */
  // @Delete(':id/shares/:shareId')
  // async revokeShare(
  //   @Param('id') folderId: string,
  //   @Param('shareId') shareId: string,
  //   @Req() request: Record<string, any>,
  // ): Promise<BaseResponse<string>> {
  //   const user: UserEntity = request.user;
  //   const data = await this.foldersService.revokeShare(folderId, shareId, user.id ?? '');
  //   return BaseResponse.makeSuccessResponse<string>(data, null, 'Folder share revoked successfully.');
  // }
}
