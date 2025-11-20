import { Module } from '@nestjs/common';
import { CandidatesController } from './../../controllers/candidates-controller/app.controller';
import { CandidatesService } from '../../services/candidates-service/candidates.service';

@Module({
  imports: [],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class AppModule {}
