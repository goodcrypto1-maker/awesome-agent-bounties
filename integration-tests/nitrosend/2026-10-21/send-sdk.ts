import { Nitrosend } from '@nitrosend/sdk';

const key = process.env.NITROSEND_API_KEY;
const idempotencyKey = process.env.NITROSEND_IDEMPOTENCY_KEY;
if (!key || !idempotencyKey) throw new Error('Set both required environment variables');

const originalFetch = globalThis.fetch;
let requests = 0;
globalThis.fetch = async (input, init) => {
  if (requests++ > 0) throw new DOMException('Automatic repeat blocked', 'AbortError');
  return originalFetch(input, { ...init, redirect: 'error' });
};

const ns = new Nitrosend(key);
const result = await ns.messages.send({
  channel: 'email',
  to: 'proof@dogfood.nitrosend.net',
  subject: 'Nitrosend integration test — SDK',
  html: '<p>Requested first-send integration test from GaryWorkAgent. No reply needed.</p>',
}, idempotencyKey);
console.log(JSON.stringify({ id: result.id, status: result.status }));
