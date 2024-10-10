"use strict";
const $stdlib = require('@winglang/sdk');
const $macros = require("@winglang/sdk/lib/macros");
const $platforms = ((s) => !s ? [] : s.split(';'))(process.env.WING_PLATFORMS);
const $outdir = process.env.WING_SYNTH_DIR ?? ".";
const $wing_is_test = process.env.WING_IS_TEST === "true";
const std = $stdlib.std;
const $helpers = $stdlib.helpers;
const $extern = $helpers.createExternRequire(__dirname);
const $types = require("./types.cjs");
const $PlatformManager = new $stdlib.platform.PlatformManager({platformPaths: $platforms});
class $Root extends $stdlib.std.Resource {
  constructor($scope, $id) {
    super($scope, $id);
    $helpers.nodeof(this).root.$preflightTypesMap = { };
    let $preflightTypesMap = {};
    const tf = $helpers.bringJs(`${__dirname}/preflight.tf-4.cjs`, $preflightTypesMap);
    const math = $stdlib.math;
    $helpers.nodeof(this).root.$preflightTypesMap = $preflightTypesMap;
    globalThis.$ClassFactory.new("@winglibs/tf.Element", tf.Element, this, "Element", ({"provider": [({"aws": ({})}), ({"aws": ({"alias": "secondary", "region": "us-west-1"})}), ({"aws": ({"alias": "third", "region": "us-east-2"})})]}));
    const deployableRegions = ["us-east-1", "us-east-2", "us-west-1"];
    const globalTags = ({"ManagedBy": "CDKTF via Wing", "Version": "v0.0.1", "Platform": "jmurillo9", "Environment": "nonprod", "Project": "silver-parakeet"});
    for (const region of deployableRegions) {
      console.log(("\nDeploying to region: " + region));
      const bucket = globalThis.$ClassFactory.new("@winglibs/tf.Resource", tf.Resource, this, String.raw({ raw: ["silver_parakeet_", "_bucket"] }, region), ({"terraformResourceType": "aws_s3_bucket", "attributes": ({"bucket": String.raw({ raw: ["silver-parakeet-", "-bucket-", ""] }, region, (math.Util.ceil((math.Util.random(100))))), "force_destroy": true, "tags": globalTags})}));
    }
  }
}
const $APP = $PlatformManager.createApp({ outdir: $outdir, name: "main", rootConstruct: $Root, isTestEnvironment: $wing_is_test, entrypointDir: process.env['WING_SOURCE_DIR'], rootId: process.env['WING_ROOT_ID'] });
$APP.synth();
//# sourceMappingURL=preflight.cjs.map