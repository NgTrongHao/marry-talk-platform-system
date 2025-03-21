import { BloggerBlogPost } from './type/blogger-blog-post.entity';

export interface IBlogService {
  getBlogPostById(id: string): Promise<BloggerBlogPost>;

  getAllBlogPost(): Promise<BloggerBlogPost[]>;
}
