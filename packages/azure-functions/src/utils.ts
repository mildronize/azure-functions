import { blue, green, yellow } from 'colorette';
import { AfterServerStartedMetadata, NammathamApp, trimSlash } from '@nammatham/core';
import { AzureFunctionsEndpoint } from './types';

export function getMethods(func: AzureFunctionsEndpoint<any, any>): string[] {
  if (!Array.isArray(func.endpointOption?.methods)) {
    return [];
  }
  const methods = func.endpointOption?.methods?.map(method => method.toUpperCase()) ?? [];
  return methods;
}

export function getFullUrl(func: AzureFunctionsEndpoint<any, any>, port?: number): string {
  const endpoint = func.endpointOption?.route ?? func.name;
  if(typeof endpoint !== 'string') return '';
  return `http://localhost${port ? `:${port}` : ''}/api/${trimSlash(endpoint)}`;
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function printRegisteredFunctions(app: NammathamApp, option: AfterServerStartedMetadata): Promise<AzureFunctionsEndpoint<any, any>[]> {
  const azureFunctions = app.functions
    .filter(func => func.type === 'azure-functions')
    .filter(func => func.endpointOption?.type === 'http') as AzureFunctionsEndpoint<any, any>[];
  if (azureFunctions.length === 0) return [];
  await delay(100);
  console.log(`\n${yellow('Functions:')}\n`);
  for (const func of azureFunctions) {
    const methods = `[${getMethods(func).join(',')}]`;
    console.log(`\t${yellow(func.name)}: ${blue(methods)} ${green(getFullUrl(func, option.port))}\n`);
  }
  console.log('');
  return azureFunctions;
}

/**
 * FIXME: This functions is duplicated with printRegisteredFunctions, it should be merged later.
 */
export async function printRegisteredNonHttpFunctions(app: NammathamApp, option: AfterServerStartedMetadata): Promise<AzureFunctionsEndpoint<any, any>[]> {
  const azureFunctions = app.functions.filter(func => func.type === 'azure-functions').filter(func => func.endpointOption?.type !== 'http') as AzureFunctionsEndpoint<
    any,
    any
  >[];
  if (azureFunctions.length === 0) return [];
  await delay(100);
  console.log(`${yellow(`----------------------------------------------`)}\n`);
  console.log(`\n${yellow('Non-HTTP Functions (In Develpment Mode Only):')}\n`);
  for (const func of azureFunctions) {
    const methods = `[GET]`;
    console.log(`\t${yellow(func.name)}: ${blue(methods)} ${green(getFullUrl(func, option.port))}\n`);
  }
  console.log('');
  return azureFunctions;
}
