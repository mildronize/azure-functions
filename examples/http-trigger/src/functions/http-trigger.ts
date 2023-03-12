import { app, InvocationContext, HttpRequest, HttpHandler } from '@azure/functions';
import { controller, context, functionName, httpTrigger, Logger, logger } from '@nammatham/core';

@controller()
export class MyController {
  @functionName('http')
  public httpTrigger(
    @httpTrigger({ authLevel: 'anonymous', methods: ['GET'], route: 'my-data' }) req: HttpRequest,
    @context() context: InvocationContext,
    @logger() log: Logger
  ) {
    // log.info(req.toString());
    // return {
    //   body: 'Hello',
    // }
    console.log('hello from httpTrigger');
    console.log(req, context, log);
  }
}
