import { Body, Controller, HttpStatus, Post, UseGuards, Headers, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { VerificationDTO } from './dto/verification.dto';
import { InviteDto, InviteVerificationDto } from './dto/invite.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { VerificationGuard } from 'src/core/guard/verification.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('me')
  @UseGuards(AuthGuard)
  async currentUser(@CurrentUser() user: User) {
    const data = await this.authService.currentUser(user.id || '');
    return new BaseResponse<User>({
      data: data,
      message: "Profile fetched!.",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return new BaseResponse<{ accessToken: string, user: User }>({
      data: data,
      message: "Login successful",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('refresh')
  async refresh(@Body() dto: { token: string }) {
    const data = await this.authService.refresh(dto);
    return new BaseResponse<{ accessToken: string }>({
      data: data,
      message: "Token refreshed",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('verify-invite')
  async verify(@Body() dto: InviteVerificationDto) {

    const data = await this.authService.verifyInvitation(dto);

    return new BaseResponse<User>({
      data: data,
      message: "Profile verification successful",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDTO) {
    const data = await this.authService.resetPassword(dto);
    return new BaseResponse<boolean>({
      data: data,
      message: "Profile verification successful",
      statusCode: HttpStatus.OK,
    });
  }

  @Post('forgot')
  async forgot(@Body() dto: ForgotPasswordDTO) {
    const data = await this.authService.initiateForgotPassword(dto);
    return new BaseResponse<{ token: string }>({
      data: data,
      message: "Verification code sent!",
      statusCode: HttpStatus.OK,
    });
  }

  // create an invitation token for the provided payload (e.g. email)
  // @Post('invite')
  // async invite(@Body() payload: InviteDto) {
  //   return { token: this.authService.generateInvitationToken(payload) };
  // }
}
