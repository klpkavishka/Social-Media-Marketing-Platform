import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';
import { Generation, GenerationSchema } from './schemas/generation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Generation.name, schema: GenerationSchema }]),
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService],
  exports: [HashtagsService],
})
export class HashtagsModule {}

