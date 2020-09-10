import program from 'commander';
import https from 'http';
import open from 'open';
import { Scope } from './fitbit-api'
program.description('Spotify Refresh Token Tool');

import { generateAuthUrl, getTokens } from './fitbit-api';

program
  .command('token <clientId> <clientSecret> <scopes>')
  .alias('t')
  .description('Start Fitbit OAuth Flow')
  .action((clientId: string, clientSecret: string, scopes: Scope[]) => {
    console.log('Starting HTTPS server to receive OAuth2 data from Fitbit...');
    
    https
      .createServer(async (req, res) => {
        const url = new URL(`https://localhost${req.url}`);
        const code = url.searchParams.get('code');

        if (!code) {
          return;
        }

        console.log('Got the code. Getting the refresh token now...');

        const tokens = await getTokens(
          clientId,
          clientSecret,
          code,
          scopes.join(' '),
          'code',
        );

        console.log(`Here's your refresh token:`);
        console.log(tokens.refresh_token);

        res.write(`Your refresh token is:\n${tokens.refresh_token}`);
        res.end();
        setTimeout(() => process.exit(0), 1000);
      })
      .listen(5071);

    const authUrl = generateAuthUrl(clientId, scopes);
    console.log(
      'I will open a browser window for you.',
      'Please log in using your Fitbit credentials.',
    );
    console.log();
    console.log("In case your browser doesn't open, here's the link:", authUrl);

    try {
      open(authUrl);
    } catch (e) {}
  });

program.parse(process.argv);