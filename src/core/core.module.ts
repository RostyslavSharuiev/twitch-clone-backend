import { Module } from '@nestjs/common';

import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
