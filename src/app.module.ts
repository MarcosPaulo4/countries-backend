import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AxiosModule } from './axios/axios.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 900, // 15min in sec
      isGlobal: true,
    }),
    AxiosModule,
    CountriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
