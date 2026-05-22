import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Content } from '../content/entities/content.entity';
import { UserCampaign, UserCampaignDocument } from './schemas/user-campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectModel(UserCampaign.name)
    private readonly userCampaignModel: Model<UserCampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const { contentIds, ...campaignData } = createCampaignDto;
    
    // 1. Create and save in PostgreSQL to get a UUID and maintain relations
    const campaign = this.campaignRepository.create(campaignData);
    if (contentIds && contentIds.length > 0) {
      const contents = await this.contentRepository.findBy({
        id: In(contentIds),
      });
      campaign.contents = contents;
    }
    const savedCampaign = await this.campaignRepository.save(campaign);

    // 2. Save in MongoDB UserCampaign collection
    try {
      const mongoCampaign = new this.userCampaignModel({
        ...campaignData,
        id: savedCampaign.id,
        contentIds: contentIds || [],
      });
      await mongoCampaign.save();
    } catch (error) {
      console.error('Failed to save campaign to MongoDB:', error);
    }

    return savedCampaign;
  }

  async findAll(options: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    let total = await this.userCampaignModel.countDocuments(filter);
    
    // Sync legacy/existing campaigns from Postgres if MongoDB is empty
    if (total === 0 && !status && page === 1) {
      const pgCampaigns = await this.campaignRepository.find({ relations: ['contents'] });
      if (pgCampaigns.length > 0) {
        for (const pgC of pgCampaigns) {
          try {
            const mongoCampaign = new this.userCampaignModel({
              id: pgC.id,
              name: pgC.name,
              description: pgC.description,
              goals: pgC.goals,
              status: pgC.status,
              startDate: pgC.startDate,
              endDate: pgC.endDate,
              budget: Number(pgC.budget),
              spend: Number(pgC.spend),
              platforms: pgC.platforms,
              targetAudience: pgC.targetAudience,
              targeting: pgC.targeting,
              impressions: pgC.impressions,
              clicks: pgC.clicks,
              engagements: pgC.engagements,
              conversions: pgC.conversions,
              reach: pgC.reach,
              contentIds: pgC.contents?.map(c => c.id) || [],
              userId: pgC.userId,
              createdAt: pgC.createdAt,
              updatedAt: pgC.updatedAt,
            });
            await mongoCampaign.save();
          } catch (e) {
            console.error('Failed to sync pg campaign to mongo:', e);
          }
        }
        total = await this.userCampaignModel.countDocuments(filter);
      }
    }

    const campaigns = await this.userCampaignModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

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
    let campaign = await this.userCampaignModel.findOne({ id }).exec();

    if (!campaign) {
      // Try to find in Postgres and sync
      const pgC = await this.campaignRepository.findOne({
        where: { id },
        relations: ['contents'],
      });
      if (pgC) {
        try {
          const mongoCampaign = new this.userCampaignModel({
            id: pgC.id,
            name: pgC.name,
            description: pgC.description,
            goals: pgC.goals,
            status: pgC.status,
            startDate: pgC.startDate,
            endDate: pgC.endDate,
            budget: Number(pgC.budget),
            spend: Number(pgC.spend),
            platforms: pgC.platforms,
            targetAudience: pgC.targetAudience,
            targeting: pgC.targeting,
            impressions: pgC.impressions,
            clicks: pgC.clicks,
            engagements: pgC.engagements,
            conversions: pgC.conversions,
            reach: pgC.reach,
            contentIds: pgC.contents?.map(c => c.id) || [],
            userId: pgC.userId,
            createdAt: pgC.createdAt,
            updatedAt: pgC.updatedAt,
          });
          campaign = await mongoCampaign.save();
        } catch (e) {
          console.error('Failed to sync single pg campaign to mongo:', e);
        }
      }
    }

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const { contentIds, ...campaignData } = updateCampaignDto;
    
    // Ensure the campaign is tracked/loaded
    await this.findOne(id);

    const updateObj: any = { ...campaignData };
    if (contentIds !== undefined) {
      updateObj.contentIds = contentIds;
    }

    const campaign = await this.userCampaignModel.findOneAndUpdate(
      { id },
      { $set: updateObj },
      { new: true }
    ).exec();

    // Keep PostgreSQL in sync
    try {
      const pgCampaign = await this.campaignRepository.findOne({ where: { id } });
      if (pgCampaign) {
        Object.assign(pgCampaign, campaignData);
        if (contentIds !== undefined) {
          if (contentIds.length > 0) {
            const contents = await this.contentRepository.findBy({
              id: In(contentIds),
            });
            pgCampaign.contents = contents;
          } else {
            pgCampaign.contents = [];
          }
        }
        await this.campaignRepository.save(pgCampaign);
      }
    } catch (e) {
      console.error('Failed to sync update to postgres:', e);
    }

    return campaign;
  }

  async remove(id: string) {
    await this.userCampaignModel.deleteOne({ id }).exec();

    try {
      const pgCampaign = await this.campaignRepository.findOne({ where: { id } });
      if (pgCampaign) {
        await this.campaignRepository.remove(pgCampaign);
      }
    } catch (e) {
      console.error('Failed to remove from postgres:', e);
    }

    return { message: 'Campaign deleted successfully' };
  }

  async getAnalytics(id: string) {
    const campaign = await this.findOne(id);
    const contents = await this.getContents(id);
    
    // Calculate derived metrics
    const spend = Number(campaign.spend) || 0;
    const budget = Number(campaign.budget) || 0;
    const conversions = campaign.conversions || 0;
    const engagements = campaign.engagements || 0;
    const clicks = campaign.clicks || 0;
    const impressions = campaign.impressions || 0;
    
    const roi = spend === 0 ? 0 : (((conversions * 100 + engagements * 1) - spend) / spend) * 100;
    const cpe = engagements === 0 ? 0 : spend / engagements;
    const cpc = clicks === 0 ? 0 : spend / clicks;
    const ctr = impressions === 0 ? 0 : (clicks / impressions) * 100;
    const engagementRate = impressions === 0 ? 0 : (engagements / impressions) * 100;

    // Calculate goal completion rates
    const daysTotal = campaign.startDate && campaign.endDate 
      ? Math.ceil((campaign.endDate.getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const daysElapsed = campaign.startDate 
      ? Math.ceil((new Date().getTime() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const budgetUtilization = budget > 0 ? (spend / budget) * 100 : 0;

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
        allocated: budget,
        spent: spend,
        remaining: budget - spend,
        utilizationPercentage: budgetUtilization,
      },
      performance: {
        impressions,
        reach: campaign.reach || 0,
        clicks,
        engagements,
        conversions,
      },
      metrics: {
        roi,
        cpe,
        cpc,
        ctr,
        engagementRate,
      },
      content: {
        totalPieces: contents.length,
        byStatus: this.groupContentByStatus(contents),
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

    if (!campaign.contentIds) {
      campaign.contentIds = [];
    }

    const exists = campaign.contentIds.includes(contentId);
    if (!exists) {
      await this.userCampaignModel.updateOne(
        { id: campaignId },
        { $push: { contentIds: contentId } }
      ).exec();
      campaign.contentIds.push(contentId);
    }

    // Keep PG in sync
    try {
      const pgCampaign = await this.campaignRepository.findOne({
        where: { id: campaignId },
        relations: ['contents'],
      });
      if (pgCampaign) {
        if (!pgCampaign.contents) pgCampaign.contents = [];
        if (!pgCampaign.contents.some(c => c.id === contentId)) {
          pgCampaign.contents.push(content);
          await this.campaignRepository.save(pgCampaign);
        }
      }
    } catch (e) {
      console.error('Failed to sync addContent to postgres:', e);
    }

    return campaign;
  }

  async removeContent(campaignId: string, contentId: string) {
    const campaign = await this.findOne(campaignId);
    if (campaign.contentIds) {
      const updatedContentIds = campaign.contentIds.filter(id => id !== contentId);
      await this.userCampaignModel.updateOne(
        { id: campaignId },
        { $set: { contentIds: updatedContentIds } }
      ).exec();
      campaign.contentIds = updatedContentIds;
    }

    // Keep PG in sync
    try {
      const pgCampaign = await this.campaignRepository.findOne({
        where: { id: campaignId },
        relations: ['contents'],
      });
      if (pgCampaign && pgCampaign.contents) {
        pgCampaign.contents = pgCampaign.contents.filter(c => c.id !== contentId);
        await this.campaignRepository.save(pgCampaign);
      }
    } catch (e) {
      console.error('Failed to sync removeContent from postgres:', e);
    }

    return campaign;
  }

  async getContents(campaignId: string) {
    const campaign = await this.findOne(campaignId);
    if (!campaign.contentIds || campaign.contentIds.length === 0) {
      return [];
    }
    return this.contentRepository.findBy({
      id: In(campaign.contentIds),
    });
  }
}
