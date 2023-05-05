import { Module } from '@nestjs/common';
import { BlogUserController } from './blog-user.controller';
import { BlogUserDbRepository } from './repository/blog-user.db-repository';
import { BlogUserService } from './blog-user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogUserModel, BlogUserSchema } from './blog-user.model';
import { NotifyModule } from '../notify/notify.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlogUserModel.name, schema: BlogUserSchema }]), NotifyModule],
  providers: [BlogUserDbRepository, BlogUserService],
  controllers: [BlogUserController],
  exports: [BlogUserDbRepository],
})
export class BlogUserModule {}
