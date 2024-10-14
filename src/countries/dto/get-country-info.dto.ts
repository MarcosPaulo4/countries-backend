export class CountryInfoDto {
  countryName: string;
  borders: string[];
  populationData: [
    {
      year: number;
      value: number;
    },
  ];
  flagUrl: string;
}
