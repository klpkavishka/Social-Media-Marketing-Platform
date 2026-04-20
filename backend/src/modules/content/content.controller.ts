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
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Public } from '../../common/decorators';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.contentService.findAll({ page, limit, status, type });
  }

  @Public()
  @Get('calendar')
  getCalendar(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.contentService.getCalendar(startDate, endDate);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Public()
  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.contentService.publish(id);
  }

  @Public()
  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body('scheduledDate') scheduledDate: Date) {
    return this.contentService.schedule(id, scheduledDate);
  }
}
