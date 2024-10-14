export interface NagerCountryInfo {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: NagerCountryInfo[] | null;
}
