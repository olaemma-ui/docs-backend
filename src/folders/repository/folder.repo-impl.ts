import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Folder } from "../entities/folder.entity";
import { User } from "src/user/entities/user.entity";
import { Team } from "src/team/entities/team.entity";
import { IFolderRepository } from "./folder.repo";
import { FindFolderDto } from "../dto/find-folder.dto";
import { log } from "console";

@Injectable()
export class FolderRepository implements IFolderRepository {
    constructor(
        @InjectRepository(Folder)
        private readonly folderRepo: Repository<Folder>
    ) { }


    async createFolder(folder: Folder): Promise<Folder> {
        const f = await this.folderRepo.create(folder)
        return await this.folderRepo.save(f);
    }

    async updateFolder(id: string, folder: Partial<Folder>): Promise<Folder | null> {
        await this.folderRepo.update(id, folder);
        return await this.findFolderById(id);
    }

    async deleteFolder(id: string): Promise<void> {
        await this.folderRepo.delete(id);
    }


    async findFolderById(id: string, ownerId?: string): Promise<Folder | null> {
        const qb = this.folderRepo.createQueryBuilder('folder')
            .leftJoinAndSelect('folder.owner', 'owner')
            .leftJoinAndSelect('folder.parent', 'parent')
            .where('folder.id = :id', { id });

        if (ownerId) {
            qb.andWhere('owner.id = :ownerId', { ownerId });
        }

        return await qb.getOne();
    }


    async findUserFolders(userId: string, folderId: string, dto?: FindFolderDto): Promise<{
        data: Folder[];
        meta: {
            total: number;
            currentPage: number;
            totalPages: number;
        }
    }> {
        const skip = ((dto?.pageNumber ?? 1) - 1) * (dto?.pageSize ?? 10);

        const query = this.folderRepo
            .createQueryBuilder('folder')
            .leftJoin('folder.owner', 'owner')
            .addSelect(['owner.id', 'owner.email', 'owner.fullName'])
            .leftJoin('folder.parent', 'parent')
            .where('owner.id = :userId', { userId })
            // This automatically adds a "filesCount" property in each folder object
            .loadRelationCountAndMap('folder.filesCount', 'folder.files');


        if (folderId.length > 0) {
            query.andWhere('folder.id =:folderId', { folderId })
        }
        // Search by name (case-insensitive)
        if (dto?.search && dto?.search.trim() !== '') {
            query.andWhere('LOWER(folder.name) LIKE LOWER(:search)', {
                search: `%${dto?.search}%`,
            });
        }

        // Sorting
        query.orderBy(`folder.${dto?.sortBy ?? 'createdAt'}`, dto?.sortOrder ?? 'ASC');

        // Pagination
        query.skip(skip).take(dto?.pageSize);

        // Fetch results + total count
        const [data, total] = await query.getManyAndCount();

        return {
            data,
            meta: {
                total,
                currentPage: (dto?.pageNumber ?? 1),
                totalPages: Math.ceil(total / (dto?.pageSize ?? 10)),
            }
        };
    }



    async findAll(dto: FindFolderDto): Promise<{
        data: Folder[];
        total: number;
        currentPage: number;
        totalPages: number;
    }> {
        const skip = ((dto.pageNumber ?? 1) - 1) * (dto.pageSize ?? 10);

        const query = this.folderRepo.createQueryBuilder('folder');

        // Search by name (case-insensitive)
        if (dto.search && dto.search.trim() !== '') {
            query.andWhere('LOWER(folder.name) LIKE LOWER(:search)', {
                search: `%${dto.search}%`,
            });
        }

        // Sorting
        query.orderBy(`folder.${dto.sortBy}`, dto.sortOrder);

        // Pagination
        query.skip(skip).take(dto.pageSize);

        // Fetch results + total count
        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            currentPage: (dto.pageNumber ?? 1),
            totalPages: Math.ceil(total / (dto.pageSize ?? 10)),
        };
    }


    // async findTeamFolders(team: Team): Promise<Folder[]> {
    //     return await this.folderRepo.find({
    //         where: { team: { id: team.id } },
    //         relations: ["parent"],
    //         order: { createdAt: "DESC" },
    //     });
    // }

    async findSubFolders(parentId: string): Promise<Folder[]> {
        return await this.folderRepo.find({
            where: { parent: { id: parentId } },
            relations: ["owner"],
        });
    }

    async exists(name: string, userId: string): Promise<boolean> {
        const count = await this.folderRepo.count({
            where: { name, owner: { id: userId } }
        });
        return count > 0;
    }

    async renameFolder(id: string, newName: string): Promise<Folder> {
        const folder = await this.findFolderById(id);
        if (!folder) throw new Error("Folder not found");

        folder.name = newName;
        return await this.folderRepo.save(folder);
    }

    // async findRootFolders(ownerId: string, isTeam = false): Promise<Folder[]> {
    //     return await this.folderRepo.find({
    //         where: isTeam
    //             ? { team: { id: ownerId }, parent: null }
    //             : { owner: { id: ownerId }, parent: null },
    //         relations: ["owner"],
    //         order: { createdAt: "DESC" },
    //     });
    // }
}
