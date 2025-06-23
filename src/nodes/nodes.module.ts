import { Module } from '@nestjs/common';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './nodeEntity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])], // Importing TypeOrmModule with Node entity to enable repository injection
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
