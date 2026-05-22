import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { Content } from '../content/entities/content.entity';
import { UserCampaign, UserCampaignSchema } from './schemas/user-campaign.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, Content]),
    MongooseModule.forFeature([{ name: UserCampaign.name, schema: UserCampaignSchema }]),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}

