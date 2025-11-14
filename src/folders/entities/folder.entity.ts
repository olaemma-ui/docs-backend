import { FileEntity } from "src/files/entities/file.entity";
import { User } from "src/user/entities/user.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from "typeorm";
import { Share } from "src/share/entities/share.entity";

@Entity('folders')
export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'owner_id' })
    owner?: User;

    @ManyToOne(() => Folder, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent?: Folder;

    @OneToMany(() => FileEntity, (file) => file.folder, {
        eager: false,
        cascade: true,
        lazy: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    files?: Promise<FileEntity[]>;

    // ✅ Added: Relation to shares
    @OneToMany(() => Share, (share) => share.folder, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    })
    shares?: Share[];

    @CreateDateColumn({ nullable: false })
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
