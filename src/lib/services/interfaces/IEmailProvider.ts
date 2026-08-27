export interface IEmailProvider {
  sendEmailAsync(toEmail: string, subject: string, body: string): Promise<void>;
}
