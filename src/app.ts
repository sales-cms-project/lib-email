import * as dotenv from 'dotenv';
import { NodemailerAdapter } from './mail_adapters';
import { MailAdapter } from './protocols';
import { TemplateEnum } from './templates/protocols';
import { TemplateService } from './templates/template.service';
dotenv.config();
console.log('\n\nCMD Lib\n\n');

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

async function sendMail(
  templateName: TemplateEnum,
  language: string,
): Promise<void> {
  const templateService = TemplateService.getInstance();
  const mailAdapter = await createMailAdapter();
  const dto = {
    language,
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
  console.log('Sending an email...');
  await mailAdapter.send({
    html,
    text,
    subject,
    to: 'user@test.com',
  });
  console.log('The email has been sent!');
}

async function commands(): Promise<void> {
  const args = process.argv.slice(2);
  const [command] = args;
  const commandExample =
    'Commands:\n send_mail <template name> <language=en> \n templates';

  switch (command) {
    case 'send_mail':
      const [, templateName, languageStr] = args;
      if (!templateName || templateName.trim() === '') {
        console.log(commandExample);
        break;
      }
      const language =
        languageStr && languageStr.trim() !== '' ? languageStr : 'en';

      await sendMail(templateName as TemplateEnum, language);
      break;
    case 'templates':
      console.log('\n------Templates------\n');
      Object.values(TemplateEnum).forEach((template) => console.log(template));
      console.log('\n---------------------\n');
      break;
    default:
      console.log(commandExample);
  }
}

commands()
  .then(() => console.log('\nfinish'))
  .catch((err) => console.log(err));
