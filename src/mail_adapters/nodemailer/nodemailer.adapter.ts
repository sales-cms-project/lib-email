import { createTransport, Transporter } from 'nodemailer';
import { MailAdapter, MailAdapterSendDto } from '../../protocols';

interface INodemailerAdapterSetup {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

type INodemailerAdapterData = INodemailerAdapterSetup & {
  defaultFrom: string;
};

export class NodemailerAdapter implements MailAdapter {
  private transporter!: Transporter;
  private defaultFrom: string;

  constructor(data: INodemailerAdapterData) {
    const { defaultFrom, ...setup } = data;
    this.defaultFrom = defaultFrom;
    this.createTransport(setup);
  }
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async send({
    html,
    subject,
    to,
    bcc,
    cc,
    from,
    text,
  }: MailAdapterSendDto): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: from || this.defaultFrom,
        to,
        cc,
        bcc,
        subject,
        html,
        text,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async createTransport({
    host,
    password,
    port,
    secure,
    username,
  }: INodemailerAdapterSetup): Promise<void> {
    this.transporter = createTransport({
      host,
      port,
      secure,
      auth: {
        user: username,
        pass: password,
      },
    });
  }
}
