"use strict";
const $stdlib = require('@winglang/sdk');
const $macros = require("@winglang/sdk/lib/macros");
const std = $stdlib.std;
const $helpers = $stdlib.helpers;
const $extern = $helpers.createExternRequire(__dirname);
const $types = require("./types.cjs");
let $preflightTypesMap = {};
const cdktf = require("cdktf");
class Element extends (globalThis.$ClassFactory.resolveType("cdktf.TerraformElement") ?? cdktf.TerraformElement) {
  constructor($scope, $id, config) {
    super($scope, $id, );
    this.config = config;
  }
  toTerraform() {
    return this.config;
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.Element-1.cjs")({
        $cdktf_TerraformElement: ${$stdlib.core.liftObject($stdlib.core.toLiftableModuleType(globalThis.$ClassFactory.resolveType("cdktf.TerraformElement") ?? cdktf.TerraformElement, "cdktf", "TerraformElement"))},
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
module.exports = { $preflightTypesMap, Element };
//# sourceMappingURL=preflight.element-1.cjs.map