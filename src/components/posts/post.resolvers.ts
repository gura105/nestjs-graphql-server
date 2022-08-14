import { Args, Query, Resolver } from '@nestjs/graphql';
import { PbEnv } from '@pb-config/environments/pb-env.service';
import { PostModel } from '@pb-components/posts/interfaces/post.model';
import { ConfigService } from '@nestjs/config';

@Resolver((of) => PostModel)
export class PostsResolver {
    constructor(
        private configService: ConfigService,
        private pbEnv: PbEnv
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
    @Query(()=>String, {name: 'helloConfiguration'})
    helloConfiguration() :number{
        return this.configService.get<number>('PORT') // 3333 (number型になります)
    }
    @Query(()=>String)
    helloEnv(): string{
        return this.pbEnv.DatabaseUrl;
    }
}