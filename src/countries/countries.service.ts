import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CountryPopulation } from 'src/axios/country-now/types/country-population.interface';
import { CountryNowService } from '../axios/country-now/country-now.service';
import { CountryFlag } from '../axios/country-now/types/country-flag.interface';
import { NagerService } from '../axios/nager/nager.service';
import { CACHE_KEYS } from '../constants/cache.constants';

@Injectable()
export class CountriesService {
  #logger = new Logger(CountriesService.name);

  constructor(
    private readonly nagerService: NagerService,
    private readonly countryNowService: CountryNowService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async getAvailableCountries() {
    const isCached = await this.cache.get<[]>(CACHE_KEYS.COUNTRIES);

    if (isCached?.length) {
      return isCached;
    }

    /**
     * TODO: validar se vai precisar transformar os dados pra um novo DTO - indico que sim, nesse caso, talvez nao, mas nos outros talve...
     */
    const countries = await this.nagerService.getAvailableCountries();

    await this.cache.set(CACHE_KEYS.COUNTRIES, countries, 9_000);

    return countries;
  }

  async getCountryInfoByCode(countryCode: string) {
    const isCached = await this.cache.get(
      `${CACHE_KEYS.COUNTRY_CODE}/${countryCode}`,
    );

    if (isCached) {
      return isCached;
    }

    const countryInfo =
      await this.nagerService.getCountryInfoByCode(countryCode);

    const flagInfo: CountryFlag | null = await this.countryNowService
      .countryFlag(countryCode)
      .catch(() => null);

    const populationInfo: CountryPopulation | null =
      await this.countryNowService
        .countryPopulationByCode(flagInfo?.iso3)
        .catch(() => null);

    const payload = {
      ...countryInfo,
      population: populationInfo?.populationCounts,
      flag: flagInfo?.flag,
    };

    await this.cache.set(`${CACHE_KEYS.COUNTRY_CODE}/${countryCode}`, payload);

    return payload;
  }
}
