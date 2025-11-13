"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let NotificationService = NotificationService_1 = class NotificationService {
    mailerService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendMail(email, subject, context) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject,
                template: 'base',
                context,
            });
        }
        catch (err) {
            this.logger.error('Error sending mail:', err);
            throw err;
        }
    }
    async sendFolderOrFileSharedMail(email, userName, sharedBy, itemName, itemType, openLink) {
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
    async sendProfileCreatedMail(email, userName, tempPassword, loginLink) {
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
    async sendTeamInvitedMail(email, fromName, teamName, userName, teamLink) {
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
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map