import { Module } from '@nestjs/common';
import { ImpressionModule } from '@pb-components/impression/impression.module';
import { PostsResolver } from './post.resolvers';

@Module({
  imports: [ImpressionModule],
  providers: [PostsResolver],
})
export class PostsModule {}
