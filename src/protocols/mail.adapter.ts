export interface MailAdapterSendDto {
  from: string;
  to: string;
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  text?: string;
}

export const MAIL_ADAPTER_KEY = 'MAIL_ADAPTER_KEY';
export interface MailAdapter {
  verify(): Promise<boolean>;
  send(dto: MailAdapterSendDto): Promise<boolean>;
}
