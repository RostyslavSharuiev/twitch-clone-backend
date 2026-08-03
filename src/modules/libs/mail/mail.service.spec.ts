import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MailService } from './mail.service';

jest.mock('@react-email/components', () => ({
  render: jest.fn().mockResolvedValue('<p>ok</p>'),
}));

jest.mock('./templates/account-deletion.template', () => ({
  AccountDeletionTemplate: jest.fn(() => '<div>account deleted</div>'),
}));

jest.mock('./templates/deactivate.template', () => ({
  DeactivateTemplate: jest.fn(() => '<div>deactivate</div>'),
}));

jest.mock('./templates/password-recovery.template', () => ({
  PasswordRecoveryTemplate: jest.fn(() => '<div>password reset</div>'),
}));

jest.mock('./templates/verification.template', () => ({
  VerificationTemplate: jest.fn(() => '<div>verification</div>'),
}));

describe('MailService', () => {
  let service: MailService;
  let mailerService: { sendMail: jest.Mock };

  beforeEach(async () => {
    mailerService = { sendMail: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mailerService },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('http://localhost'),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('sends verification email', async () => {
    await expect(
      service.sendVerificationToken('a@test.com', 'token')
    ).resolves.toBe(true);
    expect(mailerService.sendMail).toHaveBeenCalled();
  });
});
