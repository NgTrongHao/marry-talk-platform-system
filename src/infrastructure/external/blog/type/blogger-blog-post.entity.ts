import { Entity } from '../../../../core/base/entity';

interface BloggerBlogPostProps {
  id: string;
  published: Date;
  updated: Date;
  url: string;
  title: string;
  content?: string;
  thumbnail?: string;
  author: {
    name: string;
  };
}

export class BloggerBlogPost extends Entity<BloggerBlogPostProps> {
  private constructor(props: BloggerBlogPostProps) {
    super(props);
  }

  public static build(props: BloggerBlogPostProps): BloggerBlogPost {
    return new BloggerBlogPost(props);
  }

  get id(): string {
    return this.props.id;
  }

  get published(): Date {
    return this.props.published;
  }

  get updated(): Date {
    return this.props.updated;
  }

  get url(): string {
    return this.props.url;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string | undefined {
    return this.props.content;
  }

  get thumbnail(): string | undefined {
    return this.props.thumbnail;
  }

  get author(): {
    name: string;
  } {
    return this.props.author;
  }
}
