  import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
  import { AccountStatus, UserRoles } from '../user.enums';
  import { Folder } from 'src/folders/entities/folder.entity';


  @Entity('users')
  export class User {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true, default: null, })
    creatorId?: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: false })
    fullName: string;

    @Column({ enum: AccountStatus, default: AccountStatus.PENDING })
    status: AccountStatus;

    @Column({ nullable: true, select: false })
    passwordHash?: string;

    @Column({ nullable: false, select: false })
    tempPasswordHash: string;

    @Column('text', { array: true, default: [], select: false })
    previousPasswords?: string[];

    @OneToMany(() => Folder, (folder) => folder.owner)
    folders?: Folder[];

    @Column({ default: UserRoles.USER, enum: UserRoles })
    role: UserRoles;

    @CreateDateColumn()
    createdAt?: Date;
    
  }

