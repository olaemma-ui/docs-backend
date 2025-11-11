import { SharePermission, GranteeType } from '../entities/folder-share.entity';

export class FolderShareResponseDto {
  id!: string;
  folderId!: string;
  granteeType!: GranteeType;
  granteeId!: string;
  permission!: SharePermission;
  sharedById!: string;
  createdAt!: Date;
}
