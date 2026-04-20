import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.campaignsService.findAll({ page, limit, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Get(':id/analytics')
  getAnalytics(@Param('id') id: string) {
    return this.campaignsService.getAnalytics(id);
  }

  @Get(':id/contents')
  getContents(@Param('id') id: string) {
    return this.campaignsService.getContents(id);
  }

  @Post(':id/contents/:contentId')
  addContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.campaignsService.addContent(id, contentId);
  }

  @Delete(':id/contents/:contentId')
  removeContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    return this.campaignsService.removeContent(id, contentId);
  }
}
