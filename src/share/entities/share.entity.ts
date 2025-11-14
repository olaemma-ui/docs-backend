import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, Unique, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Folder } from 'src/folders/entities/folder.entity';
import { ShareAccess } from '../enums/share-access.enum';
import { Team } from 'src/team/entities/team.entity';

@Entity('shares')
@Unique(['file', 'folder'])
export class Share {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    sharedBy: User;

    @ManyToMany(() => User)
    @JoinTable()
    sharedWithUsers: User[];

    @ManyToMany(() => Team)
    @JoinTable()
    sharedWithTeams: Team[];

    @ManyToOne(() => FileEntity, { nullable: true, eager: true, onDelete: 'CASCADE' })
    file?: FileEntity;

    @ManyToOne(() => Folder, (folder) => folder.shares, {
        nullable: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    folder?: Folder;

    @Column({ enum: ShareAccess, default: ShareAccess.VIEW })
    access: ShareAccess;

    @Column({ nullable: true })
    note?: string;

    @CreateDateColumn()
    sharedAt: Date;
}


