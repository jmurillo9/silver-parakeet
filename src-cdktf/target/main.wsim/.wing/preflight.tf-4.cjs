"use strict";
const $stdlib = require('@winglang/sdk');
const $macros = require("@winglang/sdk/lib/macros");
const std = $stdlib.std;
const $helpers = $stdlib.helpers;
const $extern = $helpers.createExternRequire(__dirname);
const $types = require("./types.cjs");
const $preflightTypesMap = {};
Object.assign(module.exports, $helpers.bringJs(`${__dirname}/preflight.resource-3.cjs`, $preflightTypesMap));
Object.assign(module.exports, $helpers.bringJs(`${__dirname}/preflight.provider-2.cjs`, $preflightTypesMap));
Object.assign(module.exports, $helpers.bringJs(`${__dirname}/preflight.element-1.cjs`, $preflightTypesMap));
module.exports = { ...module.exports, $preflightTypesMap };
//# sourceMappingURL=preflight.tf-4.cjs.map