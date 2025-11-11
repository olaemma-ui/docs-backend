import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from 'src/user/entities/user.entity';

export enum GranteeType {
    USER = 'user',
    TEAM = 'team',
}

export enum SharePermission {
    VIEWER = 'VIEWER',
    EDITOR = 'EDITOR',
    FULL = 'FULL',
}

@Entity('folder_shares')
export class FolderShare {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Folder, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'folder_id' })
    folder: Folder;

    @Column({ type: 'enum', enum: GranteeType })
    granteeType: GranteeType;

    @Column()
    granteeId: string; // user id or team id

    @Column({ type: 'enum', enum: SharePermission })
    permission: SharePermission;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'shared_by' })
    sharedBy: User;

    @CreateDateColumn()
    createdAt?: Date;
}
// import { User } from "src/user/entity/user.entity";
// import { Folder } from "./folder.entity";
// import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";

// @Entity('folder_shares')
// export class FolderShare {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @ManyToOne(() => Folder, (folder) => folder.shares, { onDelete: 'CASCADE' })
//     folder: Folder;

//     @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
//     user: User;

//     @Column({ type: 'enum', enum: ['VIEW', 'EDIT', 'MANAGE'], default: 'VIEW' })
//     permission: 'VIEW' | 'EDIT' | 'MANAGE';

//     @CreateDateColumn()
//     sharedAt: Date;
// }
