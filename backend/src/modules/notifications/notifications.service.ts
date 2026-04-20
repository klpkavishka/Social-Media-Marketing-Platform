import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async findAll(options: { page: number; limit: number; read?: string }) {
    const { page, limit, read } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .skip(skip)
      .take(limit)
      .orderBy('notification.createdAt', 'DESC');

    if (read !== undefined) {
      queryBuilder.andWhere('notification.read = :read', {
        read: read === 'true',
      });
    }

    const [notifications, total] = await queryBuilder.getManyAndCount();

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount() {
    const count = await this.notificationRepository.count({
      where: { read: false },
    });

    return { count };
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string) {
    const notification = await this.findOne(id);
    notification.read = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead() {
    await this.notificationRepository.update(
      { read: false },
      { read: true, readAt: new Date() },
    );

    return { message: 'All notifications marked as read' };
  }

  async remove(id: string) {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
    return { message: 'Notification deleted successfully' };
  }
}
