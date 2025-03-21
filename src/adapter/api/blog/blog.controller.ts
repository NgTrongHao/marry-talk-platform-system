import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IBlogService } from '../../../infrastructure/external/blog/blog-service.interface';

@Controller('blogs')
@ApiTags('Blog')
export class BlogController {
  constructor(@Inject('IBlogService') private blogService: IBlogService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get blog post by id REST API',
    description:
      'Get blog post by id REST API is used to get a blog post by id.',
  })
  async getBlogPostById(@Param('id') id: string) {
    return await this.blogService.getBlogPostById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all blog posts REST API',
    description: 'Get all blog posts REST API is used to get all blog posts.',
  })
  async getAllBlogPosts() {
    return await this.blogService.getAllBlogPost();
  }
}
