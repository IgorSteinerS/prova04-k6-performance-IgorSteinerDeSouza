import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const searchDuration = new Trend('search_anime_duration', true);
export const detailsDuration = new Trend('get_details_duration', true);
export const charactersDuration = new Trend('get_characters_duration', true);
export const RateContentOK = new Rate('content_OK');

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.25'],
    http_req_duration: ['p(90)<6800'],
    search_anime_duration: ['p(90)<6800'],
    content_OK: ['rate>0.75']
  },
  stages: [
    { duration: '10s', target: 7 },
    { duration: '2m50s', target: 92 }, 
    { duration: '30s', target: 0 }
  ]
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://api.jikan.moe/v4';
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  sleep(Math.random() * 40);

  const OK = 200;

  let resSearch = http.get(`${baseUrl}/anime?q=Re:Zero&limit=1`, params);
  
  if (resSearch.status === 429) {
    sleep(2);
    resSearch = http.get(`${baseUrl}/anime?q=Re:Zero&limit=1`, params);
  }

  searchDuration.add(resSearch.timings.duration);
  RateContentOK.add(resSearch.status === OK);
  check(resSearch, {
    'GET Search "Re:Zero" - Status 200': () => resSearch.status === OK
  });

  sleep(Math.random() * 30 + 30);

  const animeId = 31240;
  let resDetails = http.get(`${baseUrl}/anime/${animeId}`, params);

  if (resDetails.status === 429) {
    sleep(2);
    resDetails = http.get(`${baseUrl}/anime/${animeId}`, params);
  }

  detailsDuration.add(resDetails.timings.duration);
  RateContentOK.add(resDetails.status === OK);
  check(resDetails, {
    'GET Anime Details - Status 200': () => resDetails.status === OK
  });

  sleep(Math.random() * 30 + 30);

  let resChars = http.get(`${baseUrl}/anime/${animeId}/characters`, params);

  if (resChars.status === 429) {
    sleep(2);
    resChars = http.get(`${baseUrl}/anime/${animeId}/characters`, params);
  }

  charactersDuration.add(resChars.timings.duration);
  RateContentOK.add(resChars.status === OK);
  check(resChars, {
    'GET Anime Characters - Status 200': () => resChars.status === OK
  });

  sleep(Math.random() * 10 + 5);
}