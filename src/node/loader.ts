import { PLUGIN_NAME } from './constants';

console.log('loader load===>');

export function pitch() {
  // @ts-expect-error this type
  const callback = this[PLUGIN_NAME];
}
