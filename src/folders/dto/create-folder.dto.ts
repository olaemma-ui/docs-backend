import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFolderDto {

    @IsString({})
    @IsOptional()
    parentId: string;

    @IsNotEmpty({message: 'Folder name is required*'})
    @IsString()
    name: string;
}
