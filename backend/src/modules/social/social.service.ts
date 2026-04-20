import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount, AccountStatus } from './entities/social-account.entity';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
  ) {}

  async create(createSocialAccountDto: CreateSocialAccountDto) {
    const account = this.socialAccountRepository.create(createSocialAccountDto);
    return this.socialAccountRepository.save(account);
  }

  async findAll(options: { platform?: string; status?: string }) {
    const { platform, status } = options;
    const queryBuilder = this.socialAccountRepository
      .createQueryBuilder('account')
      .orderBy('account.createdAt', 'DESC');

    if (platform) {
      queryBuilder.andWhere('account.platform = :platform', { platform });
    }

    if (status) {
      queryBuilder.andWhere('account.status = :status', { status });
    }

    const accounts = await queryBuilder.getMany();
    return { data: accounts };
  }

  async findOne(id: string) {
    const account = await this.socialAccountRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Social account with ID ${id} not found`);
    }

    return account;
  }

  async update(id: string, updateSocialAccountDto: UpdateSocialAccountDto) {
    const account = await this.findOne(id);
    Object.assign(account, updateSocialAccountDto);
    return this.socialAccountRepository.save(account);
  }

  async remove(id: string) {
    const account = await this.findOne(id);
    await this.socialAccountRepository.remove(account);
    return { message: 'Social account deleted successfully' };
  }

  async connect(id: string, credentials: any) {
    const account = await this.findOne(id);
    
    // TODO: Implement actual OAuth connection logic
    account.status = AccountStatus.CONNECTED;
    account.accessToken = credentials.accessToken || 'encrypted_token';
    account.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return this.socialAccountRepository.save(account);
  }

  async disconnect(id: string) {
    const account = await this.findOne(id);
    account.status = AccountStatus.DISCONNECTED;
    account.accessToken = null as any;
    account.tokenExpiry = null as any;

    return this.socialAccountRepository.save(account);
  }

  async getStats(id: string) {
    const account = await this.findOne(id);

    // TODO: Implement actual stats fetching from social media APIs
    return {
      accountId: account.id,
      platform: account.platform,
      followers: 0,
      engagement: 0,
      posts: 0,
      reach: 0,
    };
  }
}
