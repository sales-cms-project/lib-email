import * as dotenv from 'dotenv';
import { NodemailerAdapter } from './mail_adapters';
import { MailAdapter } from './protocols';
import { TemplateEnum } from './templates/protocols';
import { TemplateService } from './templates/template.service';
dotenv.config();
console.log('Test Lib');

const templateMailParameter = {
  [TemplateEnum.WELCOME]: {
    username: 'Test User',
  },
};

const templateMailSubjectParameter = {
  [TemplateEnum.WELCOME]: {
    username: 'User',
  },
};

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

async function sendMail(templateName: TemplateEnum): Promise<void> {
  const templateService = TemplateService.getInstance();
  const mailAdapter = await createMailAdapter();
  const dto = {
    language: 'en',
    template: templateName,
  };

  const { html, text } = await templateService.getTemplate({
    ...dto,
    parameters: templateMailParameter[templateName],
  });
  const subject = await templateService.getSubject({
    ...dto,
    parameters: templateMailSubjectParameter[templateName],
  });

  await mailAdapter.send({
    html,
    text,
    subject,
    to: 'user@test.com',
  });
}

async function commands(): Promise<void> {
  const args = process.argv.slice(2);
  const [command] = args;
  const commandExample = 'Commands:\n send_mail <template name> \n templates';

  switch (command) {
    case 'send_mail':
      const [, templateName] = args;
      if (!templateName || templateName.trim() === '') {
        console.log(commandExample);
        break;
      }
      await sendMail(templateName as TemplateEnum);
      break;
    default:
      console.log(commandExample);
  }
}

commands()
  .then(() => console.log('\nfinish'))
  .catch((err) => console.log(err));
