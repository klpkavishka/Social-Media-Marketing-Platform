import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../common/decorators/public.decorator';
import { HashtagsService } from './hashtags.service';
import { HashtagPredictionDto, CaptionResultDto } from './dto';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  /**
   * Stage 1: ML Model — classify image, generate hashtags + basic caption
   */
  @Public()
  @Post('predict')
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() file: Express.Multer.File): Promise<HashtagPredictionDto> {
    return this.hashtagsService.predict(file);
  }

  /**
   * Stage 2: AI Enhanced Caption — generate tone-specific caption using OpenRouter
   */
  @Public()
  @Post('generate-caption')
  @UseInterceptors(FileInterceptor('image'))
  async generateCaption(
    @UploadedFile() file: Express.Multer.File,
    @Body('tone') tone: string,
    @Body('hashtags') hashtags: string,
    @Body('category') category: string,
  ): Promise<CaptionResultDto> {
    return this.hashtagsService.generateCaption(file, tone, hashtags, category);
  }
}
