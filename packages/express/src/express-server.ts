import type { BaseHandlerResolver, NammathamApp } from '@nammatham/core';

import express from 'express';
import { logger, logo } from '@nammatham/core';
import { blue, gray, greenBright } from 'colorette';

import type { NammathamHttpHandlerOption } from './types';

import { createExpressMiddleware } from './middleware';

export interface ExpressServerOption {
  prefix?: string;
  port?: number;
  expressApp?: express.Express;
  dev?: boolean;
  allowAllFunctionsAccessByHttp?: boolean;
}

/**
 * Express Server Plugin
 */
export function expressPlugin(option?: ExpressServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    const isDevelopment = option?.dev ?? false;
    app.setDevelopment(isDevelopment);
    console.log(app.runtime, 'runtime')
    console.log(isDevelopment, 'isDevelopment')
    if (isDevelopment === false && app.runtime === 'azure-functions') {
      return;
    } else {
      logger.info('Starting express server in development mode');
    }
    app.setRuntime('express');
    logger.debug(`Using plugin: expressPlugin`);
    startExpress(
      {
        handlerResolver,
        app,
      },
      option
    );
  };
}

export function startExpress(
  { app, handlerResolver }: NammathamHttpHandlerOption,
  expressOption?: ExpressServerOption
) {
  logger.debug('Starting express server');
  const expressApp = expressOption?.expressApp ?? express();
  const port = expressOption?.port ?? 3000;
  const prefix = expressOption?.prefix ?? '/api';
  const allowAllFunctionsAccessByHttp = expressOption?.allowAllFunctionsAccessByHttp ?? false;

  // https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  expressApp.disable('etag');
  expressApp.use(
    prefix,
    createExpressMiddleware({
      app,
      handlerResolver,
      option: {
        allowAllFunctionsAccessByHttp,
      },
      // createContext,
    })
  );

  expressApp.listen(port, async () => {
    console.clear();
    const endTime = performance.now();
    const durationMs = Math.floor(endTime - app.startTime);
    logger.debug(`Server started at http://localhost:${port}`);
    console.log(`${await logo()}  ${gray(`ready in ${durationMs} ms`)}\n`);
    console.log(`\n${blue('Express server started')}\n`);
    console.log(` ┃ Local  ${greenBright(`http://localhost:${port}`)}`);
    console.log(` ┃ Host   ${gray('Not Available')} \n`);

    await handlerResolver.afterServerStarted(app, { port, allowAllFunctionsAccessByHttp });
    console.log('\n');
  });
}
