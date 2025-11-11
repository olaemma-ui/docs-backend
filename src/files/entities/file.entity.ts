import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Folder } from "src/folders/entities/folder.entity";
import { User } from "src/user/entities/user.entity";

@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @Column()
    key: string; // S3 object key or storage path

    @Column()
    url: string; // public or presigned URL

    @Column({ nullable: true })
    size?: number; // in bytes

    @Column({ nullable: true })
    mimeType?: string;

    @Column({ nullable: true })
    version?: number; // optional version control

    @Column({ nullable: true })
    versionId?: string; // optional version control

    @ManyToOne(() => Folder, (folder) => folder.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'folder_id', })
    folder: Folder;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'uploader_id', })
    uploader: User;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
