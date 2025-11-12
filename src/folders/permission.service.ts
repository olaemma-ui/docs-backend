// import { Injectable } from '@nestjs/common';
// import { FolderRepository } from './repository/folder.repo-impl';
// import { FolderShareRepository } from './repository/folder-share.repo-impl';
// import { UserRepository } from 'src/user/repository/user-repo-impl';
// import { SharePermission, GranteeType } from './entities/folder-share.entity';

// @Injectable()
// export class PermissionService {
//     constructor(
//         private readonly folderRepo: FolderRepository,
//         private readonly folderShareRepo: FolderShareRepository,
//         private readonly userRepo: UserRepository,
//     ) { }

//     /**
//      * Check whether a given userId has at least the required permission on folderId.
//      * requiredPermission: 'VIEWER' | 'EDITOR' | 'FULL'
//      */
//     async hasPermission(userId: string, folderId: string, requiredPermission: SharePermission | string): Promise<boolean> {
//         // Super admin bypass
//         const user = await this.userRepo.findById(userId);
//         if (!user) return false;
//         if (user.role === 'SUPER_ADMIN') return true;

//         // Owner check
//         const folder = await this.folderRepo.findFolderById(folderId);
//         if (!folder) return false;
//         if (folder.owner && folder.owner.id === userId) return true;

//         // Direct user share
//         const share = await this.folderShareRepo.findUserShare(folderId, userId);
//         if (!share) return false;

//         const order = [SharePermission.VIEWER, SharePermission.EDITOR, SharePermission.FULL];
//         const haveIdx = order.indexOf(share.permission as SharePermission);
//         const needIdx = order.indexOf(requiredPermission as SharePermission);
//         return haveIdx >= 0 && needIdx >= 0 && haveIdx >= needIdx;
//     }
// }
