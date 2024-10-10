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
class Provider extends (globalThis.$ClassFactory.resolveType("cdktf.TerraformProvider") ?? cdktf.TerraformProvider) {
  constructor($scope, $id, props) {
    super($scope, $id, { terraformResourceType: props.name, terraformGeneratorMetadata: ({"providerName": props.name, "providerVersion": props.version}), terraformProviderSource: props.source });
    if ((!$macros.__String_startsWith(false, (util.Util.env("WING_TARGET")), "tf"))) {
      throw new Error("tf.Provider can only be used in a Terraform target.");
    }
    this.attributes = (props.attributes ?? ({}));
  }
  synthesizeAttributes() {
    return this.attributes;
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.Provider-2.cjs")({
        $cdktf_TerraformProvider: ${$stdlib.core.liftObject($stdlib.core.toLiftableModuleType(globalThis.$ClassFactory.resolveType("cdktf.TerraformProvider") ?? cdktf.TerraformProvider, "cdktf", "TerraformProvider"))},
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
module.exports = { $preflightTypesMap, Provider };
//# sourceMappingURL=preflight.provider-2.cjs.map