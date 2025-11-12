import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { VerificationGuard } from 'src/core/guard/verification.guard';
import { ShareCreateDTO } from './dto/share-create.dto';
import { ShareRevokeDTO } from './dto/share-revoke.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { Share } from './entities/share.entity';
import { BaseResponse } from 'src/common/dto/base-response.dto';


@UseGuards(AuthGuard, VerificationGuard)
@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) { }

  /**
   * Share a file or folder
   */
  @Post()
  async share(
    @Body() dto: ShareCreateDTO,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<Share>> {
    const share = await this.shareService.share(user, dto);
    return BaseResponse.makeSuccessResponse(share, null, 'Shared successfully', 201, '/share');
  }

  /**
   * Revoke sharing for specific users, teams, or all
   */
  @Delete()
  async revoke(
    @Body() dto: ShareRevokeDTO,
    @CurrentUser() user: User,
  ): Promise<BaseResponse<null>> {
    await this.shareService.revoke(user, dto);
    return BaseResponse.makeSuccessResponse(null, null, 'Share revoked successfully', 200, '/share');
  }

  /**
   * Get all shares for a specific file
   */
  @Get('file/:id')
  async getFileShares(
    @CurrentUser() user: User,
    @Param('id') fileId: string,
  ): Promise<BaseResponse<{ users: any; teams: Team[] }>> {
    const { users, teams } = await this.shareService.getFileOrFolderShares(fileId);
    return BaseResponse.makeSuccessResponse(
      { users, teams },
      { total: users.length + teams.length, currentPage: 1, totalPages: 1 },
      'File shares retrieved successfully',
      200,
      `/share/file/${fileId}`,
    );
  }
  

  /**
   * Get all shares for a specific folder
   */
  @Get('folder/:id')
  async getFolderShares(
    @CurrentUser() user: User,
    @Param('id') folderId: string,
  ): Promise<BaseResponse<{ users: any; teams: Team[] }>> {
    const { users, teams } = await this.shareService.getFileOrFolderShares(undefined, folderId);
    return BaseResponse.makeSuccessResponse(
      { users, teams },
      { total: users.length + teams.length, currentPage: 1, totalPages: 1 },
      'Folder shares retrieved successfully',
      200,
      `/share/folder/${folderId}`,
    );
  }
}
