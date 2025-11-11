import { Test, TestingModule } from '@nestjs/testing';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FolderRepository } from './repository/folder.repo-impl';
import { UserRepository } from '../user/repository/user-repo-impl';
import { FolderShareRepository } from './repository/folder-share.repo-impl';
import { PermissionService } from './permission.service';
import { SharePermission, GranteeType } from './entities/folder-share.entity';
import { CreateFolderShareDto } from './dto/create-folder-share.dto';
import { UpdateFolderShareDto } from './dto/update-folder-share.dto';
import { User } from '../user/entities/user.entity';
import { UserRoles } from '../user/user.enums';
import { Folder } from './entities/folder.entity';
import { BaseResponse } from '../common/dto/base-response.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('FoldersController', () => {
  let controller: FoldersController;
  let service: FoldersService;
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

  const mockFoldersService = {
    createShare: jest.fn(),
    listShares: jest.fn(),
    updateShare: jest.fn(),
    revokeShare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoldersController],
      providers: [
        {
          provide: FoldersService,
          useValue: mockFoldersService,
        },
      ],
    }).compile();

    controller = module.get<FoldersController>(FoldersController);
    service = module.get<FoldersService>(FoldersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShare', () => {
    it('should create a folder share successfully', async () => {
      const dto: CreateFolderShareDto = {
        granteeType: GranteeType.USER,
        granteeId: 'shared-user-id',
        permission: SharePermission.VIEWER,
      };

      mockFoldersService.createShare.mockResolvedValue(mockShare);

      const result = await controller.createShare('test-folder-id', dto, { user: mockUser });
      expect(result).toBeInstanceOf(BaseResponse);
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockShare);
      expect(mockFoldersService.createShare).toHaveBeenCalledWith('test-folder-id', dto, mockUser.id);
    });
  });

  describe('listShares', () => {
    it('should list folder shares successfully', async () => {
      const shares = [mockShare];
      mockFoldersService.listShares.mockResolvedValue(shares);

      const result = await controller.listShares('test-folder-id', { user: mockUser });
      expect(result).toBeInstanceOf(BaseResponse);
      expect(result.error).toBe(false);
      expect(result.data).toEqual(shares);
      expect(mockFoldersService.listShares).toHaveBeenCalledWith('test-folder-id', mockUser.id);
    });
  });

  describe('updateShare', () => {
    it('should update a folder share successfully', async () => {
      const dto: UpdateFolderShareDto = {
        permission: SharePermission.EDITOR,
      };

      const updatedShare = { ...mockShare, permission: SharePermission.EDITOR };
      mockFoldersService.updateShare.mockResolvedValue(updatedShare);

      const result = await controller.updateShare('test-folder-id', 'test-share-id', dto, { user: mockUser });
      expect(result).toBeInstanceOf(BaseResponse);
      expect(result.error).toBe(false);
      expect(result.data).toEqual(updatedShare);
      expect(mockFoldersService.updateShare).toHaveBeenCalledWith('test-folder-id', 'test-share-id', dto, mockUser.id);
    });
  });

  describe('revokeShare', () => {
    it('should revoke a folder share successfully', async () => {
      mockFoldersService.revokeShare.mockResolvedValue('test-share-id');

      const result = await controller.revokeShare('test-folder-id', 'test-share-id', { user: mockUser });
      expect(result).toBeInstanceOf(BaseResponse);
      expect(result.error).toBe(false);
      expect(result.data).toEqual('test-share-id');
      expect(mockFoldersService.revokeShare).toHaveBeenCalledWith('test-folder-id', 'test-share-id', mockUser.id);
    });
  });
});
