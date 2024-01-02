import { Tokens, Option } from '../constants';
import { func } from '../nammatham';
import { DataService } from '../services/data';
import { Service } from '../services/service';
import { inversify } from './inversify-2';
import { container } from '../container';

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .handler(
    inversify(container)
      .inject<DataService>().with('dataService', DataService)
      .inject<Service>().with('service', Service)
      .inject<Option>().with('option', Tokens.Option)
      .resolve(({ dataService, option, service }) => async (request, ctx) => {
        ctx.context.log('HTTP trigger function processed a request.');
        ctx.context.debug(`Http function processed request for url "${request.url}"`);
        const name = request.query.get('name') || (await request.text()) || 'world';
        if (name === 'error') {
          throw new Error('this is an error');
        }
        console.log(`service.getData()`, service.getData());
        console.log(`dataService.getData()`, dataService.getData());
        console.log(`option`, option);
        return {
          body: dataService.getData(),
        };
      })
  );
