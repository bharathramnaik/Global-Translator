import { Injectable } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  languages: Language[];
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private countries: Country[] = [
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      languages: [
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
        { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
        { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' }
      ]
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      languages: [
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      languages: [
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      languages: [
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      languages: [
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'PT',
      name: 'Portugal',
      flag: '🇵🇹',
      languages: [
        { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      languages: [
        { code: 'pt', name: 'Portuguese (Brazilian)', nativeName: 'Português (Brasileiro)' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'MX',
      name: 'Mexico',
      flag: '🇲🇽',
      languages: [
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'AR',
      name: 'Argentina',
      flag: '🇦🇷',
      languages: [
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'JP',
      name: 'Japan',
      flag: '🇯🇵',
      languages: [
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      languages: [
        { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'KR',
      name: 'South Korea',
      flag: '🇰🇷',
      languages: [
        { code: 'ko', name: 'Korean', nativeName: '한국어' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'SG',
      name: 'Singapore',
      flag: '🇸🇬',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' }
      ]
    },
    {
      code: 'MY',
      name: 'Malaysia',
      flag: '🇲🇾',
      languages: [
        { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'TH',
      name: 'Thailand',
      flag: '🇹🇭',
      languages: [
        { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'VN',
      name: 'Vietnam',
      flag: '🇻🇳',
      languages: [
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'ID',
      name: 'Indonesia',
      flag: '🇮🇩',
      languages: [
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'PH',
      name: 'Philippines',
      flag: '🇵🇭',
      languages: [
        { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'SA',
      name: 'Saudi Arabia',
      flag: '🇸🇦',
      languages: [
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      languages: [
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'ZA',
      name: 'South Africa',
      flag: '🇿🇦',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' }
      ]
    },
    {
      code: 'NG',
      name: 'Nigeria',
      flag: '🇳🇬',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' }
      ]
    },
    {
      code: 'EG',
      name: 'Egypt',
      flag: '🇪🇬',
      languages: [
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'TR',
      name: 'Turkey',
      flag: '🇹🇷',
      languages: [
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'RU',
      name: 'Russia',
      flag: '🇷🇺',
      languages: [
        { code: 'ru', name: 'Russian', nativeName: 'Русский' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'PL',
      name: 'Poland',
      flag: '🇵🇱',
      languages: [
        { code: 'pl', name: 'Polish', nativeName: 'Polski' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'NL',
      name: 'Netherlands',
      flag: '🇳🇱',
      languages: [
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'BE',
      name: 'Belgium',
      flag: '🇧🇪',
      languages: [
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      languages: [
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'SE',
      name: 'Sweden',
      flag: '🇸🇪',
      languages: [
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'NO',
      name: 'Norway',
      flag: '🇳🇴',
      languages: [
        { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'DK',
      name: 'Denmark',
      flag: '🇩🇰',
      languages: [
        { code: 'da', name: 'Danish', nativeName: 'Dansk' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'FI',
      name: 'Finland',
      flag: '🇫🇮',
      languages: [
        { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'GR',
      name: 'Greece',
      flag: '🇬🇷',
      languages: [
        { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'HU',
      name: 'Hungary',
      flag: '🇭🇺',
      languages: [
        { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'CZ',
      name: 'Czech Republic',
      flag: '🇨🇿',
      languages: [
        { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'AT',
      name: 'Austria',
      flag: '🇦🇹',
      languages: [
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'fr', name: 'French', nativeName: 'Français' }
      ]
    },
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'NZ',
      name: 'New Zealand',
      flag: '🇳🇿',
      languages: [
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'HK',
      name: 'Hong Kong',
      flag: '🇭🇰',
      languages: [
        { code: 'zh', name: 'Cantonese', nativeName: '粵語' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    },
    {
      code: 'TW',
      name: 'Taiwan',
      flag: '🇹🇼',
      languages: [
        { code: 'zh', name: 'Traditional Chinese', nativeName: '繁體中文' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]
    }
  ];

  constructor() { }

  getCountries(): Country[] {
    return this.countries;
  }

  getLanguagesByCountry(countryCode: string): Language[] {
    const country = this.countries.find(c => c.code === countryCode);
    return country ? country.languages : [];
  }
}
