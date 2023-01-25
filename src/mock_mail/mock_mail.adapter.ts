import { MailAdapter, MailAdapterSendDto } from '../protocols';

export class MockMailAdapter implements MailAdapter {
  verify(): Promise<boolean> {
    return Promise.resolve(true);
  }
  send(dto: MailAdapterSendDto): Promise<boolean> {
    console.log(
      `\n\n--------------The ${dto.subject} mail was send with:\n ${dto} \n\n---------`,
    );
    return Promise.resolve(true);
  }
}
