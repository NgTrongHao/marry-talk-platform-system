import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../../application/usecase.interface';
import { BloggerBlogPost } from '../../type/blogger-blog-post.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class GetBlogPostByIdUsecase
  implements UseCase<string, BloggerBlogPost>
{
  private API_KEY = process.env.BLOGGER_API_KEY;
  private BLOG_ID = process.env.BLOGGER_BLOGS_ID;

  constructor(private readonly httpService: HttpService) {}

  async execute(id: string): Promise<BloggerBlogPost> {
    if (!this.API_KEY || !this.BLOG_ID) {
      throw new HttpException(
        'Missing Blogger API key or Blog ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const url = `https://www.googleapis.com/blogger/v3/blogs/${this.BLOG_ID}/posts/${id}?key=${this.API_KEY}`;

    try {
      const response: AxiosResponse<{
        id: string;
        published: string;
        updated: string;
        url: string;
        title: string;
        content: string;
        author: { displayName: string };
      }> = await lastValueFrom(this.httpService.get(url));

      const data = response.data;

      const thumbnail: string | undefined =
        this.extractFirstImage(data.content) || undefined;

      return BloggerBlogPost.build({
        id: data.id,
        published: new Date(data.published),
        updated: new Date(data.updated),
        url: data.url,
        title: data.title,
        content: data.content,
        thumbnail,
        author: {
          name: data.author.displayName,
        },
      });
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
