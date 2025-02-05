import { Test, TestingModule } from "@nestjs/testing";
import { MailService } from "./mail.service";
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from "@nestjs-modules/mailer";

const testingEmail = 'hasbanfardani@gmailcom';

describe('MailService', () => {
    let mailService: MailService;
    let prismaService: PrismaService;

    // Mock MailerService
    const mockMailerService = {
        sendMail: jest.fn().mockResolvedValue(true), // Simulasi sukses mengirim email
    };

    // Mock PrismaService
    const mockPrismaService = {
        user: {
            findFirst: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
        },
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: MailerService, useValue: mockMailerService }, // Tambahkan ini
            ],
        }).compile();

        mailService = app.get<MailService>(MailService);
        prismaService = app.get<PrismaService>(PrismaService);
    });

    it('should define sendUserEmail', () => {
        expect(mailService.sendUserEmail).toBeDefined();
    });

    it('should define sendUserConfirmation', () => {
        expect(mailService.sendUserConfirmation).toBeDefined();
    });

    it('should send user email successfully', async () => {
        const user = await prismaService.user.findFirst({
            where: { email: testingEmail },
        });
        const res = await mailService.sendUserEmail(user!, '', '', '', {});
        expect(res).toBe(true);
        expect(mockMailerService.sendMail).toHaveBeenCalled(); // Pastikan sendMail() dipanggil
    });

    it('should send user confirmation email successfully', async () => {
        const user = await prismaService.user.findFirst({
            where: { email: testingEmail },
        });
        const res = await mailService.sendUserConfirmation(user!, 'test_token');
        expect(res).toBe(true);
        expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
});
