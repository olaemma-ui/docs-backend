import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { NotificationService } from "src/notification/notification.service";
import { CreateTeamDTO } from "./dto/create-team.dto";
import { InviteMembersDTO } from "./dto/invite-team-member.dto";
import { UpdateTeamDTO } from "./dto/update-team.dto";
import { TeamRepository } from "./repository/team.repo-impl";
import { User } from "src/user/entities/user.entity";
import { InviteStatus, TeamMember } from "./entities/team-member.entity";
import { Team } from "./entities/team.entity";
import { UserRepository } from "src/user/repository/user-repo-impl";
import { TeamMemberRepository } from "./repository/team-member.repo-impl";

@Injectable()
export class TeamService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly teamRepo: TeamRepository,
    private readonly teamMemberRepo: TeamMemberRepository,
    private readonly notificationService: NotificationService,
  ) { }

  /**
   * Create a new team and invite initial members
   */
  async createTeam(admin: User, dto: CreateTeamDTO) {

    const userExist = await this.userRepo.findById(admin.id!);
    if (!userExist) throw new NotFoundException('User not found!.')

    const team = await this.teamRepo.createTeam({
      name: dto.name,
      description: dto.description,
      creator: admin,
    });

    if (dto.members?.length) {
      const members = await this.inviteMembers(
        team.id!,
        { emails: dto.members },
        admin
      );

      // send invite emails
      for (const member of members) {
        this.notificationService.sendTeamInvitedMail(
          member.user.email,
          admin.fullName,
          team.name,
          member.user.fullName,
          `team/${team.id}`
        );
      }
    }

    return team;
  }


  /**
   * Invite new members to a team
   */
  async inviteMembers(teamId: string, dto: InviteMembersDTO, creator: User) {

    const userExist = await this.userRepo.findById(creator.id!);
    if (!userExist) throw new NotFoundException('User not found!.')

    const teamExist = await this.teamRepo.findById(teamId!);
    if (!teamExist) throw new NotFoundException('Team not found!.')
    if (!teamExist.creator.id) throw new InternalServerErrorException('The Team creator is missing, reach out to the developer!.')
    if (teamExist.creator.id !== userExist.id) throw new UnauthorizedException("Only Team creator can invite new members")

    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');


    const newMembers: TeamMember[] = await Promise.all(
      dto.emails.map(async (email) => {

        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new NotFoundException(`User with ${email} does not exist!`);

        const member = new TeamMember();
        member.team = team;
        member.user = user;
        member.inviteStatus = InviteStatus.PENDING;

        return member;
      })
    );

    const members = await this.teamRepo.inviteTeamMembers(newMembers);

    // send invite emails
    for (const member of members) {
      this.notificationService.sendTeamInvitedMail(
        member.user.email,
        creator.fullName,
        member.team.name,
        member.user.fullName,
        `team/${teamId}`
      );
    }

    return members;
  }


  /**
   * Remove a member from a team
   */
  async removeMember(user: User, teamId: string, memberId: string) {

    const userExist = await this.userRepo.findById(user.id!);
    if (!userExist) throw new NotFoundException('User not found!.')

    const teamExist = await this.teamRepo.findById(teamId!);
    if (!teamExist) throw new NotFoundException('Team not found!.')
    if (!teamExist.creator.id) throw new InternalServerErrorException('The Team creator is missing, reach out to the developer!.')
    if (teamExist.creator.id !== userExist.id) throw new UnauthorizedException("Only Team creator can revoke/remove members")


    const member = await this.teamMemberRepo.findById(memberId, teamId);
    if (!member) throw new NotFoundException('Member not found in this team');

    return await this.teamRepo.removeTeamMember(member);

  }

  /**
   * Update team info (name & description only)
   */
  async updateTeam(user: User, teamId: string, dto: UpdateTeamDTO) {
    const userExist = await this.userRepo.findById(user.id!);
    if (!userExist) throw new NotFoundException('User not found!.')

    const teamExist = await this.teamRepo.findById(teamId!);
    if (!teamExist) throw new NotFoundException('Team not found!.')
    if (!teamExist.creator.id) throw new InternalServerErrorException('The Team creator is missing, reach out to the developer!.')
    if (teamExist.creator.id !== userExist.id) throw new UnauthorizedException("Only Team creator can update team data")

    return this.teamRepo.updateTeam(teamId, dto);
  }



  /**
   * Get all teams a user belongs to (with pagination & search)
   */
  async getUserTeams(user: User, page = 1, limit = 10, search?: string) {
    return this.teamRepo.findAllByUser(user, { page, limit, search });
  }

  /**
   * Get all teams a user belongs to (with pagination & search)
   */
  async findTeamById(user: User, teamId: string) {
    return this.teamRepo.findById(teamId);
  }

  /**
   * Get all teams in the system (pagination + search)
   */
  async getAllTeams(user: User, page = 1, limit = 10, search?: string) {
    return this.teamRepo.findAllTeams({ page, limit, search });
  }


  /**
   * Delete a team by ID
   */
  async deleteTeam(teamId: string) {
    return this.teamRepo.deleteTeam(teamId);
  }
}
