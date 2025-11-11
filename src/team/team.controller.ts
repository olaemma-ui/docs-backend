import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDTO } from './dto/create-team.dto';
import { UpdateTeamDTO } from './dto/update-team.dto';
import { RolesGuard } from 'src/core/guard/role.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRoles } from 'src/user/user.enums';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { VerificationGuard } from 'src/core/guard/verification.guard';
import { InviteMembersDTO } from './dto/invite-team-member.dto';

@UseGuards(
  AuthGuard,
  VerificationGuard,
  // RolesGuard,
)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }


  // @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @Post('create')
  create(
    @CurrentUser() admin: User,
    @Body() createTeamDto: CreateTeamDTO
  ) {
    return this.teamService.createTeam(admin, createTeamDto);
  }

  @Post('invite/:teamId')
  async inviteMembers(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string,
    @Body() dto: InviteMembersDTO
  ) {
    const response = await this.teamService.inviteMembers(
      teamId,
      dto,
      user
    );
    return response;
  }

  @Get(':teamId')
  async findOne(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string
  ) {
    return await this.teamService.findTeamById(
      user,
      teamId
    );
  }

  @Get('all')
  async findAllTeams(
    @CurrentUser() user: User,
    @Param('page', ParseIntPipe) page = 1,
    @Param('limit', ParseIntPipe) limit = 10,
    @Param('search') search?: string
  ) {
    return await this.teamService.getAllTeams(
      user, page, limit, search
    )
  }


  @Patch(':teamId')
  update(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDTO
  ) {
    return this.teamService.updateTeam(
      user, teamId, updateTeamDto
    );
  }

  @Delete(':teamId/member/:userId')
  removeTeamMember(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
    @Param('teamId') teamId: string
  ) {
    return this.teamService.removeMember(
      user, teamId, userId
    );
  }
}
