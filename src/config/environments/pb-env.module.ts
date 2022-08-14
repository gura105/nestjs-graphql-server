import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@pb-config/environments/env-validator';
import { PbEnv } from '@pb-config/environments/pb-env.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      validate,
      isGlobal: true,
    }),
  ],
  providers: [PbEnv],
  exports: [PbEnv],
})
export class PbEnvModule {}