import { handler, createProxy } from '@ss-graphql/ss-graphql/src/proxy.js';
const query = createProxy({ type: 'query'}, handler).another;
export default query;