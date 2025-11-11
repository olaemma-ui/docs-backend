import { PartialType } from '@nestjs/mapped-types';
import { CreateFolderDto } from './create-folder.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {

    @IsNotEmpty({ message: 'Folder id is required*' })
    @IsString()
    folderId: string;
}
