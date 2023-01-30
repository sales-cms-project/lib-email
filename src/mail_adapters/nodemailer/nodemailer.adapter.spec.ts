import { MailAdapterSendDto } from '../../protocols';
import { NodemailerAdapter } from './index';

const createTransport = {
  verify: jest.fn(() => Promise.resolve(true)),
  sendMail: jest.fn(() => Promise.resolve()),
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => createTransport),
}));

const createSut = () => ({
  defaultFrom: 'default@mail.com',
  host: 'host.mail',
  password: 'password_str',
  port: 123,
  secure: true,
  username: 'username_str',
});

const createSendMailSut = (): MailAdapterSendDto => ({
  from: 'from@mail.com',
  to: 'to@mail.com',
  subject: 'subject_str',
  bcc: ['bcc@mail.com'],
  cc: ['cc@mail.com'],
  html: 'html_str',
  text: 'text_str',
});

describe('NodemailerAdapter', () => {
  afterEach(async () => {
    await jest.clearAllMocks();
  });

  describe('verify', () => {
    it('should returns a valid value', async () => {
      const verifySpy = jest.spyOn(createTransport, 'verify');
      const sut = createSut();
      const nodemailer = new NodemailerAdapter(sut);
      const result = await nodemailer.verify();
      expect(result).toEqual(true);
      expect(verifySpy).toBeCalledTimes(1);
    });

    it('should returns a invalid value', async () => {
      jest.spyOn(createTransport, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const sut = createSut();
      const nodemailer = new NodemailerAdapter(sut);
      const result = await nodemailer.verify();
      expect(result).toEqual(false);
    });
  });

  describe('send', () => {
    it('should send an email with default sender', async () => {
      const sendMailSpy = jest.spyOn(createTransport, 'sendMail');
      const sut = createSut();

      const dto = createSendMailSut();
      delete dto.from;

      const nodemailer = new NodemailerAdapter(sut);
      const result = await nodemailer.send(dto);

      expect(result).toEqual(true);
      expect(sendMailSpy).toBeCalledTimes(1);
      expect(sendMailSpy).toBeCalledWith({
        ...dto,
        from: sut.defaultFrom,
      });
    });

    it('should send an email with custom sender', async () => {
      const sendMailSpy = jest.spyOn(createTransport, 'sendMail');
      const sut = createSut();

      const dto = createSendMailSut();

      const nodemailer = new NodemailerAdapter(sut);
      const result = await nodemailer.send(dto);

      expect(result).toEqual(true);
      expect(sendMailSpy).toBeCalledTimes(1);
      expect(sendMailSpy).toBeCalledWith({ ...dto });
    });

    it('should return false when not send the email', async () => {
      jest.spyOn(createTransport, 'sendMail').mockImplementationOnce(() => {
        throw new Error();
      });
      const sut = createSut();

      const dto = createSendMailSut();

      const nodemailer = new NodemailerAdapter(sut);
      const result = await nodemailer.send(dto);

      expect(result).toEqual(false);
    });
  });
});
