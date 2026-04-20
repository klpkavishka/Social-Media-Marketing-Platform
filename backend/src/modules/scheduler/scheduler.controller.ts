import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get('jobs')
  getJobs() {
    return this.schedulerService.getJobs();
  }

  @Post('jobs')
  scheduleJob(@Body() jobData: any) {
    return this.schedulerService.scheduleJob(jobData);
  }

  @Delete('jobs/:id')
  cancelJob(@Param('id') id: string) {
    return this.schedulerService.cancelJob(id);
  }

  @Get('jobs/:id')
  getJobStatus(@Param('id') id: string) {
    return this.schedulerService.getJobStatus(id);
  }
}
