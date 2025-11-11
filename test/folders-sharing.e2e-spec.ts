import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/entities/user.entity';
import { Folder } from '../src/folders/entities/folder.entity';
import { FolderShare, GranteeType, SharePermission } from '../src/folders/entities/folder-share.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from '../src/user/user.enums';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Folder Sharing (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let userRepo: Repository<User>;
    let folderRepo: Repository<Folder>;
    let shareRepo: Repository<FolderShare>;

    let ownerToken: string;
    let viewerToken: string;
    let owner: User;
    let viewer: User;
    let folder: Folder;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = moduleFixture.get<JwtService>(JwtService);
        userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
        folderRepo = moduleFixture.get<Repository<Folder>>(getRepositoryToken(Folder));
        shareRepo = moduleFixture.get<Repository<FolderShare>>(getRepositoryToken(FolderShare));

        // Create test users
        owner = await userRepo.save({
            email: 'owner@test.com',
            fullName: 'Test Owner',
            role: UserRoles.USER,
        });

        viewer = await userRepo.save({
            email: 'viewer@test.com',
            fullName: 'Test Viewer',
            role: UserRoles.USER,
        });

        ownerToken = jwtService.sign({ id: owner.id, email: owner.email });
        viewerToken = jwtService.sign({ id: viewer.id, email: viewer.email });

        // Create test folder
        folder = await folderRepo.save({
            name: 'Test Folder',
            owner,
        });
    });

    afterAll(async () => {
        // Cleanup
        await shareRepo.delete({});
        await folderRepo.delete({});
        await userRepo.delete({});
        await app.close();
    });

    describe('POST /folders/:id/shares', () => {
        it('should allow folder owner to create a share', () => {
            return request(app.getHttpServer())
                .post(`/folders/${folder.id}/shares`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    granteeType: GranteeType.USER,
                    granteeId: viewer.id,
                    permission: SharePermission.VIEWER,
                })
                .expect(201)
                .expect(res => {
                    expect(res.body.data).toBeDefined();
                    expect(res.body.data.granteeId).toBe(viewer.id);
                    expect(res.body.data.permission).toBe(SharePermission.VIEWER);
                });
        });

        it('should prevent non-owners from creating shares', () => {
            return request(app.getHttpServer())
                .post(`/folders/${folder.id}/shares`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .send({
                    granteeType: GranteeType.USER,
                    granteeId: 'another-user-id',
                    permission: SharePermission.VIEWER,
                })
                .expect(403);
        });
    });

    describe('GET /folders/:id/shares', () => {
        beforeEach(async () => {
            // Create a test share
            await shareRepo.save({
                folder,
                granteeType: GranteeType.USER,
                granteeId: viewer.id,
                permission: SharePermission.VIEWER,
                sharedBy: owner,
            });
        });

        it('should allow folder owner to list shares', () => {
            return request(app.getHttpServer())
                .get(`/folders/${folder.id}/shares`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.data).toBeDefined();
                    expect(Array.isArray(res.body.data)).toBe(true);
                    expect(res.body.data.length).toBeGreaterThan(0);
                });
        });

        it('should allow viewers to list shares', () => {
            return request(app.getHttpServer())
                .get(`/folders/${folder.id}/shares`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .expect(200);
        });
    });

    describe('PATCH /folders/:id/shares/:shareId', () => {
        let share: FolderShare;

        beforeEach(async () => {
            share = await shareRepo.save({
                folder,
                granteeType: GranteeType.USER,
                granteeId: viewer.id,
                permission: SharePermission.VIEWER,
                sharedBy: owner,
            });
        });

        it('should allow owner to update share permissions', () => {
            return request(app.getHttpServer())
                .patch(`/folders/${folder.id}/shares/${share.id}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .send({
                    permission: SharePermission.EDITOR,
                })
                .expect(200)
                .expect(res => {
                    expect(res.body.data.permission).toBe(SharePermission.EDITOR);
                });
        });

        it('should prevent non-owners from updating shares', () => {
            return request(app.getHttpServer())
                .patch(`/folders/${folder.id}/shares/${share.id}`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .send({
                    permission: SharePermission.EDITOR,
                })
                .expect(403);
        });
    });

    describe('DELETE /folders/:id/shares/:shareId', () => {
        let share: FolderShare;

        beforeEach(async () => {
            share = await shareRepo.save({
                folder,
                granteeType: GranteeType.USER,
                granteeId: viewer.id,
                permission: SharePermission.VIEWER,
                sharedBy: owner,
            });
        });

        it('should allow owner to revoke share', () => {
            return request(app.getHttpServer())
                .delete(`/folders/${folder.id}/shares/${share.id}`)
                .set('Authorization', `Bearer ${ownerToken}`)
                .expect(200);
        });

        it('should prevent non-owners from revoking shares', () => {
            return request(app.getHttpServer())
                .delete(`/folders/${folder.id}/shares/${share.id}`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .expect(403);
        });

        afterEach(async () => {
            await shareRepo.delete(share.id!);
        });
    });
});