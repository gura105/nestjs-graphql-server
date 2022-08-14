import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from '@pb-components/prisma/prisma.module';
import * as path from 'path';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from '@pb-components/posts/posts.module';
import { PbEnvModule } from '@pb-config/environments/pb-env.module';
import { PbEnv } from '@pb-config/environments/pb-env.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.GqlModuleOptionsFactory,
    }),
    WinstonModule.forRootAsync({
      inject: [PbEnv],
      useFactory: (env: PbEnv) => env.WinstonModuleOptionsFactory,
    }),
    PrismaModule.forRootAsync({
      imports: [WinstonModule],
      inject: [PbEnv],
      isGlobal: true,
      useFactory: (env: PbEnv) => ({
        prismaOptions: env.PrismaOptionsFactory,
      }),
    }),
    PbEnvModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}