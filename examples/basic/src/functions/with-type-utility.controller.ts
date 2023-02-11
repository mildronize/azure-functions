import { inject } from 'inversify';
import { BaseFunction, Binding, functionName } from 'nammatham';
import { Service } from './services';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
];

@functionName('WithTypeUtility', ...bindings)
export class WithTypeUtilityFunction extends BaseFunction<typeof bindings> {
  constructor(@inject(Service) private service: Service) {
    super();
  }

  public override execute() {
    const { name } = this.req.query;
    this.res.send(`hello WithTypeUtility with ${name} ${this.service.getData()}`);
  }
}
