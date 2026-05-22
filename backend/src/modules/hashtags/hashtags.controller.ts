import { Controller, Post, Get, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../common/decorators/public.decorator';
import { HashtagsService } from './hashtags.service';
import { HashtagPredictionDto, CaptionResultDto, CreateGenerationDto } from './dto';

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

  /**
   * Save a generation record in MongoDB
   */
  @Public()
  @Post('generations')
  async saveGeneration(@Body() dto: CreateGenerationDto) {
    return this.hashtagsService.saveGeneration(dto);
  }

  /**
   * Get all saved generations
   */
  @Public()
  @Get('generations')
  async getGenerations() {
    return this.hashtagsService.getGenerations();
  }

  /**
   * Get a single saved generation by ID
   */
  @Public()
  @Get('generations/:id')
  async getGeneration(@Param('id') id: string) {
    return this.hashtagsService.getGeneration(id);
  }

  /**
   * Delete a saved generation by ID
   */
  @Public()
  @Delete('generations/:id')
  async deleteGeneration(@Param('id') id: string) {
    return this.hashtagsService.deleteGeneration(id);
  }
}
