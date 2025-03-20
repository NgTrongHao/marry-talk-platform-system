import { Injectable } from '@nestjs/common';
import { UsecaseHandler } from '../../../../application/usecase-handler.service';
import { IBlogService } from '../blog-service.interface';
import { GetBlogPostByIdUsecase } from './usecase/get-blog-post-by-id.usecase';
import { GetAllBlogPostsUsecase } from './usecase/get-all-blog-posts.usecase';

@Injectable()
export class BloggerBlogService implements IBlogService {
  constructor(private useCaseHandler: UsecaseHandler) {}

  getBlogPostById(id: string) {
    return this.useCaseHandler.execute(GetBlogPostByIdUsecase, id);
  }

  getAllBlogPost() {
    return this.useCaseHandler.execute(GetAllBlogPostsUsecase);
  }
}
