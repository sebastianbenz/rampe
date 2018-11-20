import { Post } from './Post';
class Build {
  constructor(private config: {}) {}

  public all(): void {
    const posts = Post.list(this.config);
    this.render(posts);
    this.feed(posts);
  }
  public feed(posts: Array<Promise<Post>>): void {
    throw new Error('Method not implemented.');
  }
  public render(posts: Array<Promise<Post>>): void {
    throw new Error('Method not implemented.');
  }
}

export default Build;
