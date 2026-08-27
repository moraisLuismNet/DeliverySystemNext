export interface IEmailQueueService {
  enqueueEmailAsync(toEmail: string, subject: string, body: string): Promise<void>;
  getAllAsync(): Promise<any[]>;
  deleteAsync(id: number): Promise<void>;
}
