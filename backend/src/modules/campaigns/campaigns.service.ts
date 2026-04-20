import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const { contentIds, ...campaignData } = createCampaignDto;
    
    const campaign = this.campaignRepository.create(campaignData);

    // Associate contents if provided
    if (contentIds && contentIds.length > 0) {
      const contents = await this.contentRepository.findBy({
        id: In(contentIds),
      });
      campaign.contents = contents;
    }

    return this.campaignRepository.save(campaign);
  }

  async findAll(options: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.contents', 'contents')
      .skip(skip)
      .take(limit)
      .orderBy('campaign.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('campaign.status = :status', { status });
    }

    const [campaigns, total] = await queryBuilder.getManyAndCount();

    return {
      data: campaigns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['contents'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const { contentIds, ...campaignData } = updateCampaignDto;
    const campaign = await this.findOne(id);
    
    Object.assign(campaign, campaignData);

    // Update content associations if provided
    if (contentIds !== undefined) {
      if (contentIds.length > 0) {
        const contents = await this.contentRepository.findBy({
          id: In(contentIds),
        });
        campaign.contents = contents;
      } else {
        campaign.contents = [];
      }
    }

    return this.campaignRepository.save(campaign);
  }

  async remove(id: string) {
    const campaign = await this.findOne(id);
    await this.campaignRepository.remove(campaign);
    return { message: 'Campaign deleted successfully' };
  }

  async getAnalytics(id: string) {
    const campaign = await this.findOne(id);
    
    // Calculate derived metrics
    const roi = campaign.roi;
    const cpe = campaign.cpe;
    const cpc = campaign.cpc;
    const ctr = campaign.ctr;
    const engagementRate = campaign.engagementRate;

    // Calculate goal completion rates
    const daysTotal = campaign.startDate && campaign.endDate 
      ? Math.ceil((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const daysElapsed = campaign.startDate 
      ? Math.ceil((new Date().getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const budgetUtilization = campaign.budget > 0 
      ? (Number(campaign.spend) / Number(campaign.budget)) * 100 
      : 0;

    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      status: campaign.status,
      period: {
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        daysTotal,
        daysElapsed,
        daysRemaining: Math.max(0, daysTotal - daysElapsed),
      },
      budget: {
        allocated: Number(campaign.budget),
        spent: Number(campaign.spend),
        remaining: Number(campaign.budget) - Number(campaign.spend),
        utilizationPercentage: budgetUtilization,
      },
      performance: {
        impressions: campaign.impressions,
        reach: campaign.reach,
        clicks: campaign.clicks,
        engagements: campaign.engagements,
        conversions: campaign.conversions,
      },
      metrics: {
        roi,
        cpe,
        cpc,
        ctr,
        engagementRate,
      },
      content: {
        totalPieces: campaign.contents?.length || 0,
        byStatus: this.groupContentByStatus(campaign.contents),
      },
      platforms: campaign.platforms || [],
      goals: campaign.goals || [],
    };
  }

  private groupContentByStatus(contents: Content[]) {
    if (!contents || contents.length === 0) {
      return { draft: 0, scheduled: 0, published: 0, failed: 0 };
    }

    return contents.reduce((acc, content) => {
      acc[content.status] = (acc[content.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async addContent(campaignId: string, contentId: string) {
    const campaign = await this.findOne(campaignId);
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    if (!campaign.contents) {
      campaign.contents = [];
    }

    // Check if content is already associated
    const exists = campaign.contents.some((c) => c.id === contentId);
    if (!exists) {
      campaign.contents.push(content);
      await this.campaignRepository.save(campaign);
    }

    return campaign;
  }

  async removeContent(campaignId: string, contentId: string) {
    const campaign = await this.findOne(campaignId);

    if (campaign.contents) {
      campaign.contents = campaign.contents.filter((c) => c.id !== contentId);
      await this.campaignRepository.save(campaign);
    }

    return campaign;
  }

  async getContents(campaignId: string) {
    const campaign = await this.findOne(campaignId);
    return campaign.contents || [];
  }
}
