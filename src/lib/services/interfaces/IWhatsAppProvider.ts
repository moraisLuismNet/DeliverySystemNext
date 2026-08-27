export interface IWhatsAppProvider {
  sendMessageAsync(phoneNumber: string, message: string): Promise<void>;
}
