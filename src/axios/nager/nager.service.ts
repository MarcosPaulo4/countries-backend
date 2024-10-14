import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AxiosInstance, AxiosResponse, isAxiosError } from 'axios';
import { AXIOS_TOKENS } from '../axios.contants';
import { NagerAvailableCountry } from './types/available-country.interface';
import { NagerCountryInfo } from './types/country-info.interface';
import { NagerError } from './types/nager-error.interface';

@Injectable()
export class NagerService {
  #logger = new Logger(NagerService.name);

  constructor(
    @Inject(AXIOS_TOKENS.NAGER)
    private readonly nagerAxiosInstance: AxiosInstance,
  ) {}

  async getAvailableCountries(): Promise<NagerAvailableCountry[]> {
    try {
      const { data } =
        await this.nagerAxiosInstance.get<NagerAvailableCountry[]>(
          'availableCountries',
        );

      return data;
    } catch (error) {
      const buildedError = this.buildError(error);

      this.#logger.error(
        `some error occurred when try fetch infos - ${buildedError.message}`,
      );

      throw buildedError;
    }
  }

  async getCountryInfoByCode(countryCode: string) {
    try {
      const { data } = await this.nagerAxiosInstance.get<NagerCountryInfo>(
        `countryInfo/${countryCode}`,
      );

      return data;
    } catch (error) {
      const buildedError = this.buildError(error);

      this.#logger.error(
        `some error occurred when try fetch infos - ${buildedError.message}`,
      );

      throw buildedError;
    }
  }
  private buildError(error: Error | AxiosResponse | HttpException) {
    if (error instanceof HttpException) {
      return error;
    }

    if (isAxiosError<NagerError>(error)) {
      return new HttpException(
        error?.response?.data?.title || 'Unexpected error occurred',
        error?.response?.status || HttpStatus.BAD_REQUEST,
      );
    }

    return new BadGatewayException('Nager API is unavailable');
  }
}
