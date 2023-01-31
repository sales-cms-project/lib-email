import * as dotenv from 'dotenv';
import { NodemailerAdapter } from './mail_adapters';
import { MailAdapter } from './protocols';
dotenv.config();
console.log('Test Lib');

async function createMailAdapter(): Promise<MailAdapter> {
  const mailAdapter = new NodemailerAdapter({
    defaultFrom: 'test@test.com',
    host: process.env.MAIL_HOST || '',
    port: Number(process.env.PORT),
    secure: false,
    username: process.env.AUTH_USER || '',
    password: process.env.AUTH_PASS || '',
  });

  await mailAdapter.verify();
  return mailAdapter;
}

async function sendMail(templateName: string): Promise<void> {
  const mailAdapter = await createMailAdapter();
  await mailAdapter.send({
    html: '<p>welcome mail<p>',
    subject: 'welcome',
    to: 'user@test.com',
  });
}

async function commands(): Promise<void> {
  const args = process.argv.slice(2);
  const [command] = args;
  const commandExample = 'Commands:\n send_mail <template name> \n templates';

  switch (command) {
    case 'send_mail':
      const [_, templateName] = args;
      if (!templateName || templateName.trim() === '') {
        console.log(commandExample);
        break;
      }
      await sendMail(templateName);
      break;
    default:
      console.log(commandExample);
  }
}

commands()
  .then(() => console.log('\nfinish'))
  .catch((err) => console.log(err));
