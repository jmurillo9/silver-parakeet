"use strict";
const $stdlib = require('@winglang/sdk');
const $macros = require("@winglang/sdk/lib/macros");
const std = $stdlib.std;
const $helpers = $stdlib.helpers;
const $extern = $helpers.createExternRequire(__dirname);
const $types = require("./types.cjs");
let $preflightTypesMap = {};
const cdktf = require("cdktf");
const util = $stdlib.util;
class Resource extends (globalThis.$ClassFactory.resolveType("cdktf.TerraformResource") ?? cdktf.TerraformResource) {
  constructor($scope, $id, props) {
    super($scope, $id, props);
    if ((!$macros.__String_startsWith(false, (util.Util.env("WING_TARGET")), "tf"))) {
      throw new Error("tf.Resource can only be used in a Terraform target.");
    }
    this.attributes = (props.attributes ?? ({}));
  }
  synthesizeAttributes() {
    return this.attributes;
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.Resource-3.cjs")({
        $cdktf_TerraformResource: ${$stdlib.core.liftObject($stdlib.core.toLiftableModuleType(globalThis.$ClassFactory.resolveType("cdktf.TerraformResource") ?? cdktf.TerraformResource, "cdktf", "TerraformResource"))},
      })
    `;
  }
  get _liftMap() {
    return $stdlib.core.mergeLiftDeps(super._liftMap, {
      "$inflight_init": [
      ],
    });
  }
}
module.exports = { $preflightTypesMap, Resource };
//# sourceMappingURL=preflight.resource-3.cjs.map