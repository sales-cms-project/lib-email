export interface MailAdapterSendDto {
  subject: string;
  html: string;
  to: string;
  from?: string;
  bcc?: string[];
  cc?: string[];
  text?: string;
}

export const MAIL_ADAPTER_KEY = 'MAIL_ADAPTER_KEY';
export interface MailAdapter {
  verify(): Promise<boolean>;
  send(dto: MailAdapterSendDto): Promise<boolean>;
}
