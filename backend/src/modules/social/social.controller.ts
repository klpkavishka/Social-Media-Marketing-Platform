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
import { SocialService } from './social.service';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';

@Controller('social-accounts')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  create(@Body() createSocialAccountDto: CreateSocialAccountDto) {
    return this.socialService.create(createSocialAccountDto);
  }

  @Get()
  findAll(
    @Query('platform') platform?: string,
    @Query('status') status?: string,
  ) {
    return this.socialService.findAll({ platform, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialAccountDto: UpdateSocialAccountDto,
  ) {
    return this.socialService.update(id, updateSocialAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialService.remove(id);
  }

  @Post(':id/connect')
  connect(@Param('id') id: string, @Body() credentials: any) {
    return this.socialService.connect(id, credentials);
  }

  @Post(':id/disconnect')
  disconnect(@Param('id') id: string) {
    return this.socialService.disconnect(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.socialService.getStats(id);
  }
}
