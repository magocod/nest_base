import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category, Post } from './entities';
import { PostCategory } from './views.views';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Category, Post, PostCategory]),
  ],
  controllers: [ViewsController],
  providers: [ViewsService],
  exports: [TypeOrmModule],
})
export class ViewsModule {}
