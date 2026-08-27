import { Op } from "sequelize";
import { BaseRepository } from "./BaseRepository";
import { NotificationQueue } from "../models/NotificationQueue";
import { INotificationQueueRepository } from "./interfaces/INotificationQueueRepository";
import { QueueStatus } from "../models/QueueStatus";

export class NotificationQueueRepository extends BaseRepository<NotificationQueue> implements INotificationQueueRepository {
  constructor() {
    super(NotificationQueue);
  }

  async getPendingAsync(): Promise<NotificationQueue[]> {
    return await this.findAll({
      where: {
        Status: QueueStatus.Pending,
        ScheduledAt: { [Op.lte]: new Date() },
      },
      order: [["CreatedAt", "ASC"]],
      limit: 10,
    });
  }
}

export default new NotificationQueueRepository();
