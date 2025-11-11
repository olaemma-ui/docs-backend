import { Test, TestingModule } from '@nestjs/testing';
import { FoldersService } from './folders.service';
import { FolderRepository } from './repository/folder.repo-impl';
import { UserRepository } from '../user/repository/user-repo-impl';
import { FolderShareRepository } from './repository/folder-share.repo-impl';
import { PermissionService } from './permission.service';
import { SharePermission, GranteeType } from './entities/folder-share.entity';
import { User } from '../user/entities/user.entity';
import { UserRoles } from '../user/user.enums';
import { Folder } from './entities/folder.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('FoldersService', () => {
  let service: FoldersService;
  let folderRepo: FolderRepository;
  let userRepo: UserRepository;
  let folderShareRepo: FolderShareRepository;
  let permissionService: PermissionService;

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    fullName: 'Test User',
    role: UserRoles.USER,
  } as User;

  const mockFolder: Folder = {
    id: 'test-folder-id',
    name: 'Test Folder',
    owner: mockUser,
  } as Folder;

  const mockShare = {
    id: 'test-share-id',
    folder: mockFolder,
    granteeType: GranteeType.USER,
    granteeId: 'shared-user-id',
    permission: SharePermission.VIEWER,
    sharedBy: mockUser,
    createdAt: new Date(),
  };

  const mockFolderRepo = {
    findFolderById: jest.fn(),
  };

  const mockUserRepo = {
    findById: jest.fn(),
  };

  const mockFolderShareRepo = {
    createShare: jest.fn(),
    findSharesByFolder: jest.fn(),
    findById: jest.fn(),
    updateShare: jest.fn(),
    deleteShare: jest.fn(),
  };

  const mockPermissionService = {
    hasPermission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoldersService,
        { provide: FolderRepository, useValue: mockFolderRepo },
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: FolderShareRepository, useValue: mockFolderShareRepo },
        { provide: PermissionService, useValue: mockPermissionService },
      ],
    }).compile();

    service = module.get<FoldersService>(FoldersService);
    folderRepo = module.get<FolderRepository>(FolderRepository);
    userRepo = module.get<UserRepository>(UserRepository);
    folderShareRepo = module.get<FolderShareRepository>(FolderShareRepository);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShare', () => {
    const createShareDto = {
      granteeType: GranteeType.USER,
      granteeId: 'shared-user-id',
      permission: SharePermission.VIEWER,
    };

    it('should create a share when user has FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(true);
      mockFolderShareRepo.createShare.mockResolvedValue(mockShare);

      const result = await service.createShare('test-folder-id', createShareDto, mockUser.id!);
      expect(result).toBeDefined();
      expect(result.id).toBe(mockShare.id);
      expect(mockFolderShareRepo.createShare).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user lacks FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(false);

      await expect(service.createShare('test-folder-id', createShareDto, mockUser.id!))
        .rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when folder not found', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(null);

      await expect(service.createShare('test-folder-id', createShareDto, mockUser.id!))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('listShares', () => {
    it('should list shares when user has VIEWER permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(true);
      mockFolderShareRepo.findSharesByFolder.mockResolvedValue([mockShare]);

      const result = await service.listShares('test-folder-id', mockUser.id!);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockShare.id);
    });

    it('should throw ForbiddenException when user lacks VIEWER permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(false);

      await expect(service.listShares('test-folder-id', mockUser.id!))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateShare', () => {
    const updateShareDto = {
      permission: SharePermission.EDITOR,
    };

    it('should update share when user has FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(true);
      mockFolderShareRepo.findById.mockResolvedValue(mockShare);
      mockFolderShareRepo.updateShare.mockResolvedValue({ ...mockShare, permission: SharePermission.EDITOR });

      const result = await service.updateShare('test-folder-id', 'test-share-id', updateShareDto, mockUser.id!);
      expect(result).toBeDefined();
      expect(result.permission).toBe(SharePermission.EDITOR);
    });

    it('should throw ForbiddenException when user lacks FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(false);

      await expect(service.updateShare('test-folder-id', 'test-share-id', updateShareDto, mockUser.id!))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('revokeShare', () => {
    it('should revoke share when user has FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(true);
      mockFolderShareRepo.findById.mockResolvedValue(mockShare);

      const result = await service.revokeShare('test-folder-id', 'test-share-id', mockUser.id!);
      expect(result).toBe('test-share-id');
      expect(mockFolderShareRepo.deleteShare).toHaveBeenCalledWith('test-share-id');
    });

    it('should throw ForbiddenException when user lacks FULL permission', async () => {
      mockFolderRepo.findFolderById.mockResolvedValue(mockFolder);
      mockPermissionService.hasPermission.mockResolvedValue(false);

      await expect(service.revokeShare('test-folder-id', 'test-share-id', mockUser.id!))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
