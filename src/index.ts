import {AgroMarketApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import dotenv from 'dotenv';

export {AgroMarketApplication};

export async function main(options: ApplicationConfig = {}) {
  dotenv.config();
  const app = new AgroMarketApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
