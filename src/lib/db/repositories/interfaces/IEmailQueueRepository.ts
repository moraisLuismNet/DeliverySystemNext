import { EmailQueue } from "../../models/EmailQueue";
import { IBaseRepository } from "./IBaseRepository";

export interface IEmailQueueRepository extends IBaseRepository<EmailQueue> {
  getPendingAsync(): Promise<EmailQueue[]>;
}
