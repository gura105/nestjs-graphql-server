import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PostModel } from '@pb-components/posts/interfaces/post.model';
import { PrismaService } from './../prisma/prisma.service';
import { PbEnv } from '@pb-config/environments/pb-env.service';
import { GetPostsArgs } from './interfaces/get-posts-connection.args';
import { FindPostArgs } from './interfaces/find-post-args';
import { S3Client } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ImpressionService } from '@pb-components/impression/impression.service';
import { ImpressionModel } from '@pb-components/impression/interfaces/impression.model';

function streamToString(stream: Readable) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const s3Client = new S3Client({
  region: 'ap-northeast-1',
  endpoint: 'http://127.0.0.1:9000',
  forcePathStyle: true,
});

const bucket = 'dev-blog-nextjs';

@Resolver((of) => PostModel)
export class PostsResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pbEnv: PbEnv,
    private readonly impressionService: ImpressionService,
  ) {}

  @Query(() => [PostModel], { name: 'posts', nullable: true })
  async getPosts(@Args() args: GetPostsArgs) {
    return this.prisma.post.findMany({
      where: {
        type: args.type
          ? {
              in: args.type,
            }
          : undefined,
        published: true,
      },
      orderBy: {
        publishDate: 'desc',
      },
    });
  }

  @Query(() => PostModel, { name: 'findPost', nullable: false })
  async findPost(@Args() args: FindPostArgs) {
    return await this.prisma.post.findUnique({
      rejectOnNotFound: true,
      where: {
        id: args.id,
        contentPath: args.contentPath,
      },
    });
  }

  @ResolveField(() => String, { name: 'bodyMarkdown', nullable: false })
  async bodyMarkdown(@Parent() post: PostModel) {
    const { contentPath } = post;
    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: contentPath,
      }),
    );
    const result = await streamToString(Body as Readable);

    return result;
  }

  @ResolveField(() => [ImpressionModel], {
    name: 'impressions',
    nullable: false,
  })
  async impressions(@Parent() post: PostModel) {
    const { id } = post;
    return this.impressionService.search({ postId: id });
  }
}
