import { IsNumber, IsOptional, Matches, Min } from "class-validator";


export class UserFilterDTO {

    @Matches('BLACKLIST | ACTIVE')
    @IsOptional()
    status: string; 

    @IsNumber()
    @Min(1, {message: 'Page Number can not be less than 1'})
    pageNumber: number = 1; 
    
    @IsNumber()
    @Min(1, {message: 'Page Number can not be less than 1'})
    pageSize: number = 10
}