import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../../application/usecase.interface';
import { BloggerBlogPost } from '../../type/blogger-blog-post.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GetAllBlogPostsUsecase
  implements UseCase<void, BloggerBlogPost[]>
{
  private API_KEY = process.env.BLOGGER_API_KEY;
  private BLOG_ID = process.env.BLOGGER_BLOGS_ID;

  constructor(private readonly httpService: HttpService) {}

  async execute(): Promise<BloggerBlogPost[]> {
    if (!this.API_KEY || !this.BLOG_ID) {
      throw new HttpException(
        'Missing Blogger API key or Blog ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const url = `https://www.googleapis.com/blogger/v3/blogs/${this.BLOG_ID}/posts?key=${this.API_KEY}`;

    try {
      const response: AxiosResponse<{
        items: {
          id: string;
          published: string;
          updated: string;
          url: string;
          title: string;
          content: string;
          author: {
            displayName: string;
          };
        }[];
      }> = await lastValueFrom(this.httpService.get(url));

      const data = response.data;

      if (!data.items || !Array.isArray(data.items)) {
        throw new HttpException('No blog posts found', HttpStatus.NOT_FOUND);
      }

      const blogPosts = data.items.map((post) => {
        const thumbnail: string | undefined =
          this.extractFirstImage(post.content) || undefined;
        return BloggerBlogPost.build({
          id: post.id,
          published: new Date(post.published),
          updated: new Date(post.updated),
          url: post.url,
          title: post.title,
          content: post.content,
          thumbnail,
          author: {
            name: post.author.displayName,
          },
        });
      });

      if (blogPosts.length > 0) {
        return blogPosts;
      } else {
        return [];
      }
    } catch (error) {
      throw new HttpException(
        `Failed to fetch Blogger posts: ${(error as Error).message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private extractFirstImage(content: string): string | null {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(regex);
    return match ? match[1] : null;
  }
}
