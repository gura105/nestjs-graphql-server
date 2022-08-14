import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostModel } from '@pb-components/posts/interfaces/post.model';
import { PrismaService } from './../prisma/prisma.service';
import { PbEnv } from '@pb-config/environments/pb-env.service';

@Resolver((of) => PostModel)
export class PostsResolver {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pbEnv: PbEnv
        ) {}

    @Query(() => [PostModel], { name: 'posts', nullable: true })
    async getPosts() {
        return [
            {
                id: '1',
                title: 'NestJS is so good.',
            },
            {
                id: '2',
                title: 'GraphQL is so good.',
            },
        ];
    }

    @Query(() => [PostModel], { name: 'prismaPosts', nullable: true })
    async getPostsByPrisma() {
        return this.prisma.post.findMany();
    }

    @Query(() => [String], { name: 'hello', nullable: false })
    async getJustString() {
        return [
            this.pbEnv.DatabaseUrl,
            this.pbEnv.NodeEnv
        ]
    }
}