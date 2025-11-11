import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(private readonly mailerService: MailerService) { }

    async sendMail(
        email: string,
        subject: string,
        context: {
            title: string;
            subtitle?: string;
            userName?: string;
            bodyText: string;
            buttonText?: string;
            buttonLink?: string;
            teamName?: string;
        },
    ) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject,
                template: 'base',
                context,
            });
        } catch (err) {
            this.logger.error('Error sending mail:', err);
            throw err;
        }
    }

    /**
     * Folder or File Shared Notification
     */
    async sendFolderOrFileSharedMail(
        email: string,
        userName: string,
        sharedBy: string,
        itemName: string,
        itemType: 'Folder' | 'File',
        openLink: string,
    ) {
        return this.sendMail(email, `${itemType} Shared with You`, {
            title: `${itemType} Shared`,
            subtitle: `${sharedBy} just shared a ${itemType.toLowerCase()} with you.`,
            userName,
            bodyText: `You’ve been granted access to the ${itemType.toLowerCase()} <strong>${itemName}</strong>. Click below to view it.`,
            buttonText: `Open ${itemType}`,
            buttonLink: openLink,
            teamName: 'The Bertandre Docs Team',
        });
    }

    /**
     * Profile Created + Temporary Password
     */
    async sendProfileCreatedMail(
        email: string,
        userName: string,
        tempPassword: string,
        loginLink: string,
    ) {
        return this.sendMail(email, 'Welcome to Bertandre Docs', {
            title: 'Your Profile Has Been Created',
            subtitle: 'Welcome aboard!',
            userName,
            bodyText: `Your account has been successfully created. Use the temporary password below to log in. 
            Temporary Password:${tempPassword}
            Please update your password after your first login.`,
            buttonText: 'Login Now',
            buttonLink: loginLink,
            teamName: 'The Bertandre Docs Team',
        });
    }

    /**
     * Profile Created + Temporary Password
     */
    async sendTeamInvitedMail(
        email: string,
        fromName: string,
        teamName: string,
        userName: string,
        teamLink: string,
    ) {
        return this.sendMail(email, 'DocHub Invitation', {
            title: 'Team Invite',
            subtitle: `New team invite from ${fromName}`,
            userName,
            bodyText: `You've been invited to join the team ${teamName}`,
            buttonText: 'Check it out',
            buttonLink: teamLink,
            teamName: 'The Bertandre Docs Team',
        });
    }
}
