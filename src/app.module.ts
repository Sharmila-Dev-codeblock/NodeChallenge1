import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './nodes/nodeEntity';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nodeChallenge1',
      entities: [Node],
      synchronize: true,
    }),
    NodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

