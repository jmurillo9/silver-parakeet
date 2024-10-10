"use strict";
var $handler = undefined;
exports.handler = async function(event, context) {
  try {
    if (globalThis.$awsLambdaContext === undefined) {
      globalThis.$awsLambdaContext = context;
      $handler = $handler ?? (
(await (async () => {
  const klass = 
          require("/Users/jon.murillo/workspace/github/jmurillo9-public/silver-parakeet/src-cdktf/target/main.tfaws/.wing/inflight.$Closure1-1.cjs")({
          })
        ;
  const client = new klass({});
  if (client.$inflight_init) { await client.$inflight_init(); }
  return client;
})())
);
    } else {
      throw new Error(
        'An AWS Lambda context object was already defined.'
      );
    }
    return await $handler.handle(event === null ? undefined : event);
  } finally {
    globalThis.$awsLambdaContext = undefined;
  }
};