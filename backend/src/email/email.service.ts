import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { resetLinkEmail } from './templates/resetLinkEmail';
import { verificationCodeEmail } from './templates/verificationCodeEmail';
import { pinCodeEmail } from './templates/pinCodeEmail';
import { firstEntryEmail } from './templates/firstEntryEmail';
import { ConfigService } from '@nestjs/config';
import { notificationEmail } from './templates/notificationEmail';
import { landingPageEmail } from './templates/landingPageEmail';
import { passwordChangeEmail } from './templates/passwordChangeEmail';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async sendResetEmail(email: string, resetLink: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const orClickLink = this.i18n.t('translation.notificationEmails.or_click_link', {
      lang,
    });
    const confirmPasswordChange = this.i18n.t(
      'translation.notificationEmails.password_change_email.confirm_password_change',
      {
        lang,
      },
    );
    const changePassInfo = this.i18n.t('translation.notificationEmails.password_change_email.change_pass_info', {
      lang,
    });
    const contactInstitution = this.i18n.t('translation.notificationEmails.password_change_email.contact_institution', {
      lang,
    });
    const important = this.i18n.t('translation.notificationEmails.important', {
      lang,
    });
    const expireLink = this.i18n.t('translation.notificationEmails.expire_link', {
      lang,
      args: {
        time: '2',
      },
    });
    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: confirmPasswordChange,
      html: resetLinkEmail(
        resetLink,
        this.configService.get('domain'),
        orClickLink,
        confirmPasswordChange,
        changePassInfo,
        contactInstitution,
        important,
        expireLink,
        footer,
      ),
      context: {
        resetLink,
        orClickLink,
      },
    });
  }

  async sendVerificationEmail(email: string, code: string, name: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const verificationCode = this.i18n.t('translation.notificationEmails.pin_code_email.verification_code', {
      lang,
    });
    const completeVerificationProcess = this.i18n.t(
      'translation.notificationEmails.pin_code_email.complete_verification_process',
      {
        lang,
      },
    );
    const important = this.i18n.t('translation.notificationEmails.important', {
      lang,
    });
    const expireCode = this.i18n.t('translation.notificationEmails.expire_code', {
      lang,
      args: {
        time: '2',
      },
    });
    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang,
    });
    const hello = this.i18n.t('translation.notificationEmails.hello', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: verificationCode,
      html: verificationCodeEmail(
        code,
        this.configService.get('domain'),
        verificationCode,
        completeVerificationProcess,
        important,
        expireCode,
        footer,
        hello,
        name,
      ),
      context: {
        code,
      },
    });
  }

  async sendPinViaEmail(email: string, pin: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const verificationCode = this.i18n.t('translation.notificationEmails.pin_code_email.verification_code', {
      lang,
    });
    const completeVerificationProcess = this.i18n.t(
      'translation.notificationEmails.pin_code_email.complete_verification_process',
      {
        lang,
      },
    );
    const important = this.i18n.t('translation.notificationEmails.important', {
      lang,
    });
    const expireCode = this.i18n.t('translation.notificationEmails.expire_code', {
      lang,
      args: {
        time: '2',
      },
    });
    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: verificationCode,
      html: pinCodeEmail(
        pin,
        this.configService.get('domain'),
        verificationCode,
        completeVerificationProcess,
        important,
        expireCode,
        footer,
      ),
      context: {
        pin,
      },
    });
  }

  async sendFirstEntryEmail(email: string, token: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const orClickLink = this.i18n.t('translation.notificationEmails.or_click_link', {
      lang,
    });
    const activateYourAccount = this.i18n.t('translation.notificationEmails.first_entry_email.activate_your_account', {
      lang,
    });
    const welcome = this.i18n.t('translation.notificationEmails.first_entry_email.welcome', {
      lang,
    });
    const important = this.i18n.t('translation.notificationEmails.important', {
      lang,
    });
    const expireLink = this.i18n.t('translation.notificationEmails.expire_link', {
      lang,
      args: {
        time: '2',
      },
    });
    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang,
    });
    const activate = this.i18n.t('translation.notificationEmails.activate', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: activateYourAccount,
      html: firstEntryEmail(
        token,
        this.configService.get('domain'),
        orClickLink,
        activateYourAccount,
        welcome,
        footer,
        important,
        expireLink,
        activate,
      ),
    });
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    body: string,
    button?: string,
    link?: string,
    language?: string,
  ): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang: lang || language,
    });
    const orClickLink = this.i18n.t('translation.notificationEmails.or_click_link', {
      lang: lang || language,
    });
    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject,
      html: notificationEmail(this.configService.get('domain'), body, subject, footer, orClickLink, button, link),
    });
  }

  async sendLandingPageLinkEmail(email: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const orClickLink = this.i18n.t('translation.notificationEmails.or_click_link', {
      lang,
    });
    const downloadOurApp = this.i18n.t('translation.notificationEmails.landing_page_email.download_our_app', {
      lang,
    });
    const thankYou = this.i18n.t('translation.notificationEmails.landing_page_email.thank_you', {
      lang,
    });
    const important = this.i18n.t('translation.notificationEmails.important', {
      lang,
    });
    const expireLink = this.i18n.t('translation.notificationEmails.expire_link', {
      lang,
      args: {
        time: '2',
      },
    });
    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang,
    });
    const download = this.i18n.t('translation.notificationEmails.download', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: downloadOurApp,
      html: landingPageEmail(
        this.configService.get('landingPage'),
        this.configService.get('domain'),
        orClickLink,
        downloadOurApp,
        thankYou,
        important,
        expireLink,
        footer,
        download,
      ),
    });
  }

  async sendPasswordChangeEmail(email: string, passwordChangeLink: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: 'Password Change link',
      html: passwordChangeEmail(passwordChangeLink, this.configService.get('domain')),
      context: {
        passwordChangeLink,
      },
    });
  }

  async sendPasswordChangeConfirmationEmail(email: string): Promise<void> {
    const lang = I18nContext.current()?.lang;

    const footer = this.i18n.t('translation.notificationEmails.footer', {
      lang: lang,
    });
    const orClickLink = this.i18n.t('translation.notificationEmails.or_click_link', {
      lang: lang,
    });
    const info = this.i18n.t('translation.notificationEmails.password_change_email.info', {
      lang,
    });
    const contactInstitution = this.i18n.t('translation.notificationEmails.password_change_email.contact_institution', {
      lang,
    });

    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: info,
      html: notificationEmail(
        this.configService.get('domain'),
        `${info}. ${contactInstitution}`,
        info,
        footer,
        orClickLink,
      ),
    });
  }

  async sendGeneratedReport(email: string, startDate: string, endDate: string, attachment: Buffer): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `Procareful <${this.configService.get('email').from}>`,
      subject: 'Generated Report',
      html: notificationEmail(
        this.configService.get('domain'),
        `You can find the generated report for the period from ${startDate} to ${endDate} in the attachments.`,
        'Generated Report',
        'If you believe this is a mistake, please ignore this email',
        '',
      ),
      attachments: [
        {
          filename: 'institution_reports.zip',
          content: attachment,
          encoding: 'base64',
        },
      ],
    });
  }
}
