import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios from 'axios';
import { AXIOS_TOKENS, TIMEOUTS } from './axios.contants';
import { CountryNowService } from './country-now/country-now.service';
import { NagerService } from './nager/nager.service';

@Module({
  providers: [
    {
      provide: AXIOS_TOKENS.NAGER,
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.getOrThrow<string>('NAGER_API_URL');

        return Axios.create({
          baseURL,
          timeout: TIMEOUTS.AXIOS_DEFAULT_TIMEOUT,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: AXIOS_TOKENS.COUNTRY_NOW,
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.getOrThrow<string>('COUNTRY_NOW_API_URL');

        return Axios.create({
          baseURL,
          timeout: TIMEOUTS.AXIOS_DEFAULT_TIMEOUT,
        });
      },
      inject: [ConfigService],
    },
    NagerService,
    CountryNowService,
  ],
  exports: [NagerService, CountryNowService],
})
export class AxiosModule {}
