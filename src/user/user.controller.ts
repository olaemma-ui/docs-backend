import { Body, Controller, Get, Headers, HttpStatus, Param, ParseEnumPipe, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/core/guard/role.guard';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { VerificationGuard } from 'src/core/guard/verification.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRoles } from './user.enums';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';




@UseGuards(
  AuthGuard,
  VerificationGuard,
  RolesGuard,
)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }



  @Post('create')
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  async createUser(@Body() dto: CreateUserDto, @CurrentUser() user: User) {
    const data = await this.userService.createUser(dto, user);
    return new BaseResponse<User>({
      data: data,
      message: "User created successful",
      statusCode: HttpStatus.OK,
    });
  }


  @Get('all')
  // @Roles(UserRoles.SUPER_ADMIN)
  async findAllUser(
    @CurrentUser() user: User,
    @Query('page', ParseIntPipe) pageNumber?: number,
    @Query('limit', ParseIntPipe) pageSize?: number,
    // @Param('order', ParseEnumPipe<{ ASC: 'ASC', DESC: 'DESC' }>) order?: 'ASC' | 'DESC'
  ) {
    const data = await this.userService.getAllUsers(user, pageNumber, pageSize,);
    return new BaseResponse<User[]>({
      data: data.data,
      meta: {
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      },
      message: "Users fetched successful",
      statusCode: HttpStatus.OK,
    });
  }

  @Get('all-created-by-admin')
  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  async findAllUserByAdmin(
    @CurrentUser() user: User,
    @Query('page', ParseIntPipe) pageNumber?: number,
    @Query('limit', ParseIntPipe) pageSize?: number,
    // @Param('order', ParseEnumPipe<{ ASC: 'ASC', DESC: 'DESC' }>) order?: 'ASC' | 'DESC'
  ) {
    const data = await this.userService.getAllUsersCreatedByAnAdmin(user, pageNumber, pageSize,);
    return new BaseResponse<User[]>({
      data: data.data,
      meta: {
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      },
      message: "User fetched successful",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('create-super-admin')
  async createSuperAdmin(
    @Headers('x-auth-role') xAuthRole: string,
    @Body() dto: CreateUserDto,
  ) {
    const data = await this.userService.createSuperAdmin(dto, xAuthRole);
    return new BaseResponse<User>({
      data: data,
      message: 'Super admin created successfully',
      statusCode: HttpStatus.OK,
    });
  }


}
