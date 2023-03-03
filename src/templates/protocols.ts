export enum TemplateEnum {
  WELCOME = 'welcome',
  FORGOT_PASSWORD = 'forgot_password',
}

export interface IWelcomeMailParameters {
  username: string;
}

export interface IWelcomeMailSubjectParameters {
  username: string;
}

export interface IForgotPasswordParameters {
  changePasswordLink: string;
}
