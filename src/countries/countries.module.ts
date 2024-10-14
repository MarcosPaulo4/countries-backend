import { Module } from '@nestjs/common';
import { AxiosModule } from '../axios/axios.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [AxiosModule],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
