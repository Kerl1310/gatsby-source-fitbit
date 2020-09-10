import fetch from 'node-fetch';
import { PluginOptions } from './types/plugin-options';
import { TokenResponse } from './types/fitbit-token';

export const FITBIT_API_URL = 'https://api.fitbit.com/';
export const FITBIT_ACCOUNT_URL = 'http://www.fitbit.com/'
export const REDIRECT_URL = 'http://localhost:5071/fitbit';

export type Scope =
  | 'activity'
  | 'heartrate'
  | 'location'
  | 'nutrition'
  | 'profile'
  | 'settings'
  | 'sleep'
  | 'social'
  | 'weight';

export const generateAuthUrl = (
    clientId: string,
    scopes: Scope[],
    expires_in: 86400 | 604800 | 2592000 | 31536000 = 86400,
    state: string = '',
    prompt: 'none' | 'consent' | 'login' | 'login consent' = 'none',
    code_challenge: string = '',
    code_challenge_method: 'plain' | 'S256' = 'plain'
  ) => {
    const base = new URL(`${FITBIT_ACCOUNT_URL}/oauth2/authorize`);

    base.searchParams.append('response_type', 'code');
    base.searchParams.append('redirect_uri', REDIRECT_URL);
    base.searchParams.append('client_id', clientId);
    base.searchParams.append('expires_in', expires_in.toString());
    base.searchParams.append('prompt', prompt);
    base.searchParams.append('scope', scopes.join(' '));
    
    if (code_challenge) {
        base.searchParams.append('code_challenge', code_challenge);
        base.searchParams.append('code_challenge_method', code_challenge_method);
    }
    
    if (state) {
        base.searchParams.append('state', state);
    }
    
    return String(base);
  };
  
  export const getTokens = async (
    clientId: string,
    clientSecret: string,
    code: string,
    scope: string,
    responseType: 'code' | 'token',
  ) => {
    const body = new URLSearchParams();
  
    body.append('response_type', responseType);
    body.append('redirect_uri', REDIRECT_URL);
    body.append(responseType === 'token' ? 'token' : 'code', code);
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
  
    const response = await fetch(`${FITBIT_ACCOUNT_URL}/api/token`, {
      method: 'POST',
      body: body as any,
    });
  
    if (!response.ok) {
      throw new Error(`${response.statusText}: ${await response.text()}`);
    }
  
    return (await response.json()) as TokenResponse;
  };
  
const getUserData = async (
    apiKey: string,
    title: string,
    type: 'movie' | 'series' | 'episode' = 'movie',
    yearOfRelease?: number,
    returnType: 'json' = 'json', // Omdb Api accepts xml too,
    plot: 'short' | 'full' = 'full',
    version: number = 1
) => {
    const url = new URL(FITBIT_API_URL);
    url.searchParams.append('apikey', apiKey);
    url.searchParams.append('t', title);
    url.searchParams.append('type', type);
    url.searchParams.append('y', yearOfRelease.toString());
    url.searchParams.append('r', returnType);
    url.searchParams.append('plot', plot);
    url.searchParams.append('v', version.toString());

    const response = await fetch(String(url));

    if (!response.ok) {
        throw new Error(
            `[${url} | ${apiKey}] ${
            response.statusText
            }: ${await response.text()}`,
        );
    }

    const result: Movie = await response.json();
    return result;
};

export const fitbitGetUserData = async ({
         apiKey,
         text,
         type,
         yearOfRelease,
         returnType,
         plot,
         version
        }: PluginOptions) => {
            const results = await getUserData(apiKey, text, type) as Movie;
            return results;
       };
