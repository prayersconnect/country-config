import { ICountry, ICountryFeatures } from './types';
import countries from './list';
import prayersConfigs, { defaultConfig } from './prayers-configs';
import { ICountryConfig } from './types';

export function getCountryByISOName(name: string): ICountry | null {
  const key = Object.keys(countries).find((key) => {
    return countries[key].iso_name === name;
  });

  if (!key) {
    return null;
  }

  return countries[key];
}

export function getConfigByISOName(name: string): ICountryConfig {
  let countryConf;
  const countryConfOrAlias = prayersConfigs[name] || {};

  if (typeof countryConfOrAlias === 'string') {
    countryConf = prayersConfigs[countryConfOrAlias] as ICountryConfig;
  } else {
    countryConf = countryConfOrAlias as ICountryConfig;
  }

  return {
    code: countryConf?.code || null,
    alpha2Code: countryConf?.alpha2Code,
    prayerSettings: {
      ...defaultConfig.prayerSettings,
      ...countryConf?.prayerSettings,
    },
    mosque: {
      ...defaultConfig.mosque,
      ...countryConf.mosque,
    },
    features: {
      ...defaultConfig.features,
      ...countryConf.features,
    },
    intl: {
      ...defaultConfig.intl,
      ...countryConf.intl,
    },
  };
}

export function hasFeature(
  country: string,
  feature: keyof ICountryFeatures
): boolean {
  const config = getConfigByISOName(country);
  if (config) {
    return config.features[feature];
  } else {
    return defaultConfig.features[feature];
  }
}

export function getCountryAlpha2CodesByFeature(
  feature: keyof ICountryFeatures
): string[] {
  const alpha2Countries: string[] = [];
  Object.keys(prayersConfigs).map((country) => {
    if (hasFeature(country, feature)) {
      const config = getConfigByISOName(country);
      alpha2Countries.push(config.alpha2Code);
    }
  });

  return alpha2Countries;
}
