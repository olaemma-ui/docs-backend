import { MailerService } from '@nestjs-modules/mailer';
export declare class NotificationService {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    sendMail(email: string, subject: string, context: {
        title: string;
        subtitle?: string;
        userName?: string;
        bodyText: string;
        buttonText?: string;
        buttonLink?: string;
        teamName?: string;
    }): Promise<void>;
    sendFolderOrFileSharedMail(email: string, userName: string, sharedBy: string, itemName: string, itemType: 'Folder' | 'File', openLink: string): Promise<void>;
    sendProfileCreatedMail(email: string, userName: string, tempPassword: string, loginLink: string): Promise<void>;
    sendTeamInvitedMail(email: string, fromName: string, teamName: string, userName: string, teamLink: string): Promise<void>;
}
