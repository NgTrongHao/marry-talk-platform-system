import { Module } from '@nestjs/common';
import { UsecaseHandler } from '../../../application/usecase-handler.service';
import { BloggerBlogService } from './service/blogger-blog.service';
import { GetBlogPostByIdUsecase } from './service/usecase/get-blog-post-by-id.usecase';
import { HttpModule } from '@nestjs/axios';
import { GetAllBlogPostsUsecase } from './service/usecase/get-all-blog-posts.usecase';

const useCases = [GetBlogPostByIdUsecase, GetAllBlogPostsUsecase];

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    {
      provide: 'IBlogService',
      useClass: BloggerBlogService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, HttpModule, 'IBlogService'],
})
export class BlogModule {}
