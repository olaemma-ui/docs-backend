import { ShareService } from './share.service';
import { ShareCreateDTO } from './dto/share-create.dto';
import { ShareRevokeDTO } from './dto/share-revoke.dto';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { Share } from './entities/share.entity';
import { BaseResponse } from 'src/common/dto/base-response.dto';
export declare class ShareController {
    private readonly shareService;
    constructor(shareService: ShareService);
    share(dto: ShareCreateDTO, user: User): Promise<BaseResponse<Share>>;
    revoke(dto: ShareRevokeDTO, user: User): Promise<BaseResponse<null>>;
    getFileShares(user: User, fileId: string): Promise<BaseResponse<{
        users: any;
        teams: Team[];
    }>>;
    getFolderShares(user: User, folderId: string): Promise<BaseResponse<{
        users: any;
        teams: Team[];
    }>>;
}
