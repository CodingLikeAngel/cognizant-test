import { Body, Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './../../services/candidates-service/candidates.service';
import { Express } from 'express';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resumeFile'))
  uploadCandidate(
 
    @UploadedFile() file: Express.Multer.File,
    

    @Body('name') name: string,
    @Body('surname') surname: string,
  ) {

    return this.candidatesService.processExcel(file, name, surname);
  }
}