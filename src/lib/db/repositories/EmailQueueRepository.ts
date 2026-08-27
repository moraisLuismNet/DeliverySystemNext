import { BaseRepository } from "./BaseRepository";
import { EmailQueue } from "../models/EmailQueue";
import { IEmailQueueRepository } from "./interfaces/IEmailQueueRepository";

export class EmailQueueRepository extends BaseRepository<EmailQueue> implements IEmailQueueRepository {
  constructor() {
    super(EmailQueue);
  }

  async getPendingAsync(): Promise<EmailQueue[]> {
    return await this.findAll({
      where: { SentAt: null, Status: "Pending" },
      order: [["CreatedAt", "ASC"]],
      limit: 10,
    });
  }
}

export default new EmailQueueRepository();
