import { NotificationQueue } from "../../models/NotificationQueue";
import { IBaseRepository } from "./IBaseRepository";

export interface INotificationQueueRepository extends IBaseRepository<NotificationQueue> {
  getPendingAsync(): Promise<NotificationQueue[]>;
}
