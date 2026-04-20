import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../common/decorators/public.decorator';
import { HashtagsService } from './hashtags.service';
import { HashtagPredictionDto } from './dto';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Public()
  @Post('predict')
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() file: Express.Multer.File): Promise<HashtagPredictionDto> {
    return this.hashtagsService.predict(file);
  }
}
