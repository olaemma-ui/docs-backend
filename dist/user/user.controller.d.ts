import { UserService } from './user.service';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(dto: CreateUserDto, user: User): Promise<BaseResponse<User>>;
    findAllUser(user: User, pageNumber?: number, pageSize?: number, search?: string): Promise<BaseResponse<User[]>>;
    findAllUserByAdmin(user: User, pageNumber?: number, pageSize?: number): Promise<BaseResponse<User[]>>;
    createSuperAdmin(xAuthRole: string, dto: CreateUserDto): Promise<BaseResponse<User>>;
}
