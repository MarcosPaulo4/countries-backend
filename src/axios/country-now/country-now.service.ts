import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import { AXIOS_TOKENS } from '../axios.contants';
import { CountryFlag } from './types/country-flag.interface';
import { BaseCountryNowResponse } from './types/country-now.interface';
import { CountryPopulation } from './types/country-population.interface';

@Injectable()
export class CountryNowService {
  #logger = new Logger(CountryNowService.name);

  constructor(
    @Inject(AXIOS_TOKENS.COUNTRY_NOW)
    private readonly countryNowAxiosInstance: AxiosInstance,
  ) {}

  async countryFlag(countryCode?: string): Promise<CountryFlag> {
    try {
      if (!countryCode) {
        return;
      }

      const { data } = await this.countryNowAxiosInstance.get<
        BaseCountryNowResponse<CountryFlag[]>
      >('countries/flag/images');

      const flag = data?.data?.find(
        (population) => population.iso2 === countryCode,
      );

      if (!flag) {
        throw new NotFoundException(
          `flag not found by this country code: ${countryCode}`,
        );
      }

      return flag;
    } catch (error) {
      const buildedError = this.buildError(error);

      this.#logger.error(
        `some error occurred when try fetch country population info - ${buildedError.message} `,
      );

      throw buildedError;
    }
  }

  async countryPopulationByCode(iso3: string): Promise<CountryPopulation> {
    try {
      const { data } =
        await this.countryNowAxiosInstance.get<
          BaseCountryNowResponse<CountryPopulation[]>
        >(`countries/population`);

      const population = data?.data?.find(
        (population) => population.iso3.toLowerCase() === iso3.toLowerCase(),
      );

      if (!population) {
        throw new NotFoundException(
          `population not found by this country code: ${iso3}`,
        );
      }

      return population;
    } catch (error) {
      const buildedError = this.buildError(error);

      this.#logger.error(
        `some error occurred when try fetch country population info - ${buildedError.message} `,
      );

      throw buildedError;
    }
  }

  private buildError(
    error: Error | AxiosResponse | HttpException,
  ): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (isAxiosError(error)) {
      return new HttpException(
        error?.response?.data?.message || 'Unexpected error occurred',
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }

    return new BadGatewayException('CountryNow API is unavailable');
  }
}
