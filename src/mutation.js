import { handler, createProxy } from '@ss-graphql/ss-graphql/src/proxy.js';
const mutation = createProxy({ type: 'mutation' }, handler).another;
export default mutation;