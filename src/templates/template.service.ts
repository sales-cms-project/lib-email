import { TemplateEnum } from './protocols';
import * as path from 'path';
import * as ejs from 'ejs';

interface ITemplateDto<I> {
  template: TemplateEnum;
  language: string;
  parameters?: I;
}

interface IGetTemplateReturn {
  html: string;
  text: string;
}

export class TemplateService {
  private static instance?: TemplateService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async getTemplate<I>({
    language,
    template,
    parameters,
  }: ITemplateDto<I>): Promise<IGetTemplateReturn> {
    const templatePath = this.getCurrentTemplatePath(template);

    const html = await ejs.renderFile(
      `${templatePath}/mail_${language}.html`,
      parameters || {},
    );

    const text = await ejs.renderFile(
      `${templatePath}/mail_${language}.txt`,
      parameters || {},
    );
    return { html, text };
  }

  async getSubject<I>({
    language,
    template,
    parameters,
  }: ITemplateDto<I>): Promise<string> {
    const templatePath = this.getCurrentTemplatePath(template);
    const subject = await ejs.renderFile(
      `${templatePath}/subject_${language}.txt`,
      parameters || {},
    );
    return subject;
  }

  private getCurrentTemplatePath(template: TemplateEnum): string {
    return path.join(__dirname, `repositories/${template}`);
  }

  static getInstance(): TemplateService {
    if (!this.instance) this.instance = new TemplateService();
    return this.instance;
  }
}
