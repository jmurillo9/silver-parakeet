"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv/package.json
var require_package = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    __name(parse, "parse");
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    __name(_parseVault, "_parseVault");
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    __name(_log, "_log");
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    __name(_warn, "_warn");
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    __name(_debug, "_debug");
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    __name(_dotenvKey, "_dotenvKey");
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    __name(_instructions, "_instructions");
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    __name(_vaultPath, "_vaultPath");
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    __name(_resolveHome, "_resolveHome");
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    __name(_configVault, "_configVault");
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    __name(configDotenv, "configDotenv");
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    __name(config, "config");
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    __name(decrypt, "decrypt");
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    __name(populate, "populate");
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv-expand/lib/main.js
var require_main2 = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/node_modules/dotenv-expand/lib/main.js"(exports2, module2) {
    "use strict";
    function _searchLast(str, rgx) {
      const matches = Array.from(str.matchAll(rgx));
      return matches.length > 0 ? matches.slice(-1)[0].index : -1;
    }
    __name(_searchLast, "_searchLast");
    function _interpolate(envValue, environment, config) {
      const lastUnescapedDollarSignIndex = _searchLast(envValue, /(?!(?<=\\))\$/g);
      if (lastUnescapedDollarSignIndex === -1)
        return envValue;
      const rightMostGroup = envValue.slice(lastUnescapedDollarSignIndex);
      const matchGroup = /((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/;
      const match = rightMostGroup.match(matchGroup);
      if (match != null) {
        const [, group, variableName, defaultValue] = match;
        return _interpolate(
          envValue.replace(
            group,
            environment[variableName] || defaultValue || config.parsed[variableName] || ""
          ),
          environment,
          config
        );
      }
      return envValue;
    }
    __name(_interpolate, "_interpolate");
    function _resolveEscapeSequences(value) {
      return value.replace(/\\\$/g, "$");
    }
    __name(_resolveEscapeSequences, "_resolveEscapeSequences");
    function expand(config) {
      const environment = config.ignoreProcessEnv ? {} : process.env;
      for (const configKey in config.parsed) {
        const value = Object.prototype.hasOwnProperty.call(environment, configKey) ? environment[configKey] : config.parsed[configKey];
        config.parsed[configKey] = _resolveEscapeSequences(
          _interpolate(value, environment, config)
        );
      }
      for (const processKey in config.parsed) {
        environment[processKey] = config.parsed[processKey];
      }
      return config;
    }
    __name(expand, "expand");
    module2.exports.expand = expand;
  }
});

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/util/equality.js
var require_equality = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/util/equality.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deepStrictEqual = deepStrictEqual;
    var types_1 = require("util/types");
    var kNoIterator = 0;
    var kIsArray = 1;
    var kIsSet = 2;
    var kIsMap = 3;
    function deepStrictEqual(val1, val2, memos) {
      if (val1 === val2) {
        if (val1 !== 0)
          return true;
        return Object.is(val1, val2);
      }
      if (typeof val1 !== "object") {
        return typeof val1 === "number" && Number.isNaN(val1) && Number.isNaN(val2);
      }
      if (typeof val2 !== "object" || val1 === null || val2 === null) {
        return false;
      }
      if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
        return false;
      }
      const val1Tag = val1.toString();
      const val2Tag = val2.toString();
      if (val1Tag !== val2Tag) {
        return false;
      }
      if (Array.isArray(val1)) {
        if (!Array.isArray(val2) || val1.length !== val2.length) {
          return false;
        }
        const keys1 = getOwnNonIndexProperties(val1);
        const keys2 = getOwnNonIndexProperties(val2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, memos, kIsArray, keys1);
      } else if (val1Tag === "[object Object]") {
        return keyCheck(val1, val2, memos, kNoIterator);
      } else if ((0, types_1.isDate)(val1)) {
        if (!(0, types_1.isDate)(val2) || val1.getTime() !== val2.getTime()) {
          return false;
        }
      } else if ((0, types_1.isRegExp)(val1)) {
        if (!(0, types_1.isRegExp)(val2) || !areSimilarRegExps(val1, val2)) {
          return false;
        }
      } else if ((0, types_1.isNativeError)(val1) || val1 instanceof Error) {
        if (!(0, types_1.isNativeError)(val2) && !(val2 instanceof Error) || val1.message !== val2.message || val1.name !== val2.name) {
          return false;
        }
      } else if ((0, types_1.isArrayBufferView)(val1)) {
        if (!areSimilarTypedArrays(val1, val2)) {
          return false;
        }
        if (!areSimilarTypedArrays(val1, val2) && !(0, types_1.isFloat32Array)(val1) && !(0, types_1.isFloat64Array)(val1)) {
          return false;
        }
        const keys1 = getOwnNonIndexProperties(val1);
        const keys2 = getOwnNonIndexProperties(val2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, memos, kNoIterator, keys1);
      } else if ((0, types_1.isSet)(val1)) {
        if (!(0, types_1.isSet)(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, memos, kIsSet);
      } else if ((0, types_1.isMap)(val1)) {
        if (!(0, types_1.isMap)(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, memos, kIsMap);
      } else if ((0, types_1.isAnyArrayBuffer)(val1)) {
        if (!(0, types_1.isAnyArrayBuffer)(val2) || !areEqualArrayBuffers(val1, val2)) {
          return false;
        }
      } else if ((0, types_1.isBoxedPrimitive)(val1)) {
        if (!isEqualBoxedPrimitive(val1, val2)) {
          return false;
        }
      } else if (Array.isArray(val2) || (0, types_1.isArrayBufferView)(val2) || (0, types_1.isSet)(val2) || (0, types_1.isMap)(val2) || (0, types_1.isDate)(val2) || (0, types_1.isRegExp)(val2) || (0, types_1.isAnyArrayBuffer)(val2) || (0, types_1.isBoxedPrimitive)(val2) || (0, types_1.isNativeError)(val2) || val2 instanceof Error) {
        return false;
      }
      return keyCheck(val1, val2, memos, kNoIterator);
    }
    __name(deepStrictEqual, "deepStrictEqual");
    function keyCheck(val1, val2, memos, iterationType, aKeys) {
      if (arguments.length === 4) {
        aKeys = Object.keys(val1);
        const bKeys = Object.keys(val2);
        if (aKeys.length !== bKeys.length) {
          return false;
        }
      }
      let i = 0;
      for (; i < aKeys.length; i++) {
        if (!val2.propertyIsEnumerable(aKeys[i])) {
          return false;
        }
      }
      if (arguments.length === 4) {
        const symbolKeysA = Object.getOwnPropertySymbols(val1);
        if (symbolKeysA.length !== 0) {
          let count = 0;
          for (i = 0; i < symbolKeysA.length; i++) {
            const key = symbolKeysA[i];
            if (val1.propertyIsEnumerable(key)) {
              if (!val2.propertyIsEnumerable(val2, key)) {
                return false;
              }
              aKeys.push(aKeys, key);
              count++;
            } else if (val2.propertyIsEnumerable(val2, key)) {
              return false;
            }
          }
          const symbolKeysB = Object.getOwnPropertySymbols(val2);
          if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
            return false;
          }
        } else {
          const symbolKeysB = Object.getOwnPropertySymbols(val2);
          if (symbolKeysB.length !== 0 && getEnumerables(val2, symbolKeysB).length !== 0) {
            return false;
          }
        }
      }
      if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
        return true;
      }
      if (memos === void 0) {
        memos = {
          val1: /* @__PURE__ */ new Map(),
          val2: /* @__PURE__ */ new Map(),
          position: 0
        };
      } else {
        const val2MemoA = memos.val1.get(val1);
        if (val2MemoA !== void 0) {
          const val2MemoB = memos.val2.get(val2);
          if (val2MemoB !== void 0) {
            return val2MemoA === val2MemoB;
          }
        }
        memos.position++;
      }
      memos.val1.set(val1, memos.position);
      memos.val2.set(val2, memos.position);
      const areEq = objEquiv(val1, val2, aKeys, memos, iterationType);
      memos.val1.delete(val1);
      memos.val2.delete(val2);
      return areEq;
    }
    __name(keyCheck, "keyCheck");
    function objEquiv(a, b, keys, memos, iterationType) {
      let i = 0;
      if (iterationType === kIsSet) {
        if (!setEquiv(a, b, memos)) {
          return false;
        }
      } else if (iterationType === kIsMap) {
        if (!mapEquiv(a, b, memos)) {
          return false;
        }
      } else if (iterationType === kIsArray) {
        for (; i < a.length; i++) {
          if (a.hasOwnProperty(i)) {
            if (!b.hasOwnProperty(i) || !deepStrictEqual(a[i], b[i], memos)) {
              return false;
            }
          } else if (b.hasOwnProperty(i)) {
            return false;
          } else {
            const keysA = Object.keys(a);
            for (; i < keysA.length; i++) {
              const key = keysA[i];
              if (!b.hasOwnProperty(key) || !deepStrictEqual(a[key], b[key], memos)) {
                return false;
              }
            }
            if (keysA.length !== Object.keys(b).length) {
              return false;
            }
            return true;
          }
        }
      }
      for (i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!deepStrictEqual(a[key], b[key], memos)) {
          return false;
        }
      }
      return true;
    }
    __name(objEquiv, "objEquiv");
    function setEquiv(a, b, memo) {
      let set = null;
      for (const val of a) {
        if (typeof val === "object" && val !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(val);
        } else if (!b.has(val)) {
          return false;
        }
      }
      if (set !== null) {
        for (const val of b) {
          if (typeof val === "object" && val !== null) {
            if (!setHasEqualElement(set, val, memo))
              return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    __name(setEquiv, "setEquiv");
    function setHasEqualElement(set, val1, memo) {
      for (const val2 of set) {
        if (deepStrictEqual(val1, val2, memo)) {
          set.delete(val2);
          return true;
        }
      }
      return false;
    }
    __name(setHasEqualElement, "setHasEqualElement");
    function mapEquiv(a, b, memo) {
      let set = null;
      for (const { 0: key, 1: item1 } of a) {
        if (typeof key === "object" && key !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(key);
        } else {
          const item2 = b.get(key);
          if (item2 === void 0 && !b.has(key) || !deepStrictEqual(item1, item2, memo)) {
            return false;
          }
        }
      }
      if (set !== null) {
        for (const { 0: key, 1: item } of b) {
          if (typeof key === "object" && key !== null) {
            if (!mapHasEqualEntry(set, a, key, item, memo))
              return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    __name(mapEquiv, "mapEquiv");
    function mapHasEqualEntry(set, map, key1, item1, memo) {
      for (const key2 of set) {
        if (deepStrictEqual(key1, key2, memo) && deepStrictEqual(item1, map.get(key2), memo)) {
          set.delete(key2);
          return true;
        }
      }
      return false;
    }
    __name(mapHasEqualEntry, "mapHasEqualEntry");
    function isEqualBoxedPrimitive(val1, val2) {
      if ((0, types_1.isNumberObject)(val1)) {
        return (0, types_1.isNumberObject)(val2) && Object.is(val1.valueOf(), val2.valueOf());
      }
      if ((0, types_1.isStringObject)(val1)) {
        return (0, types_1.isStringObject)(val2) && val1.valueOf() === val2.valueOf();
      }
      if ((0, types_1.isBooleanObject)(val1)) {
        return (0, types_1.isBooleanObject)(val2) && val1.valueOf() === val2.valueOf();
      }
      if ((0, types_1.isSymbolObject)(val1)) {
        return (0, types_1.isSymbolObject)(val2) && val1.valueOf() === val2.valueOf();
      }
      throw new Error(`Unknown boxed type ${val1}`);
    }
    __name(isEqualBoxedPrimitive, "isEqualBoxedPrimitive");
    function areEqualArrayBuffers(buf1, buf2) {
      return buf1.byteLength === buf2.byteLength && Buffer.compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
    }
    __name(areEqualArrayBuffers, "areEqualArrayBuffers");
    function areSimilarTypedArrays(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      return Buffer.compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
    }
    __name(areSimilarTypedArrays, "areSimilarTypedArrays");
    function isNonIndex(key) {
      if (key.length === 0 || key.length > 10)
        return true;
      for (var i = 0; i < key.length; i++) {
        var code = key.charCodeAt(i);
        if (code < 48 || code > 57)
          return true;
      }
      return key.length === 10 && key >= Math.pow(2, 32);
    }
    __name(isNonIndex, "isNonIndex");
    var getOwnNonIndexProperties = /* @__PURE__ */ __name((val1) => {
      if (!val1?.getOwnPropertySymbols) {
        return [];
      }
      return Object.keys(val1).filter(isNonIndex).concat(val1?.getOwnPropertySymbols(val1).filter(Object.prototype.propertyIsEnumerable.bind(val1))) ?? [];
    }, "getOwnNonIndexProperties");
    function getEnumerables(val, keys) {
      return keys.filter((k) => val.propertyIsEnumerable(k));
    }
    __name(getEnumerables, "getEnumerables");
    function areSimilarRegExps(a, b) {
      return a.source === b.source && a.flags === b.flags && a.lastIndex === b.lastIndex;
    }
    __name(areSimilarRegExps, "areSimilarRegExps");
  }
});

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/helpers.js
var require_helpers = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/helpers.js"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.eq = eq;
    exports.neq = neq;
    exports.assert = assert;
    exports.range = range;
    exports.nodeof = nodeof;
    exports.normalPath = normalPath;
    exports.unwrap = unwrap;
    exports.lookup = lookup;
    exports.assign = assign;
    exports.createExternRequire = createExternRequire;
    exports.resolve = resolve;
    exports.bringJs = bringJs;
    exports.preflightClassSingleton = preflightClassSingleton;
    exports.loadEnvVariables = loadEnvVariables;
    var node_assert_1 = require("node:assert");
    var node_fs_1 = __importDefault(require("node:fs"));
    var path = __importStar(require("node:path"));
    var dotenv_1 = require_main();
    var dotenv_expand_1 = require_main2();
    var equality_1 = require_equality();
    function eq(a, b) {
      try {
        return (0, equality_1.deepStrictEqual)(a, b);
      } catch {
        return false;
      }
    }
    __name(eq, "eq");
    function neq(a, b) {
      try {
        (0, node_assert_1.notDeepStrictEqual)(a, b);
        return true;
      } catch {
        return false;
      }
    }
    __name(neq, "neq");
    function assert(condition, message) {
      if (!condition) {
        throw new Error("assertion failed: " + message);
      }
    }
    __name(assert, "assert");
    function range(start, end, inclusive) {
      function* iterator() {
        let i = start;
        let limit = inclusive ? end < start ? end - 1 : end + 1 : end;
        while (i < limit)
          yield i++;
        while (i > limit)
          yield i--;
      }
      __name(iterator, "iterator");
      return iterator();
    }
    __name(range, "range");
    function nodeof(construct) {
      const Node = eval("require('./std/node').Node");
      return Node.of(construct);
    }
    __name(nodeof, "nodeof");
    function normalPath(p) {
      return p.replace(/\\+/g, "/");
    }
    __name(normalPath, "normalPath");
    function unwrap(value) {
      if (value != null) {
        return value;
      }
      throw new Error("Unexpected nil");
    }
    __name(unwrap, "unwrap");
    function lookup(obj, index) {
      if (isBytes(obj)) {
        obj = obj._data;
      }
      checkIndex(index);
      if (typeof index === "number") {
        index = checkArrayAccess(obj, index);
        return obj[index];
      }
      if (typeof obj !== "object") {
        throw new TypeError(`Lookup failed, value is not an object (found "${typeof obj}")`);
      }
      if (!(index in obj)) {
        throw new RangeError(`Key "${index}" not found`);
      }
      return obj[index];
    }
    __name(lookup, "lookup");
    function assign(obj, index, kind, value) {
      if (isBytes(obj)) {
        obj = obj._data;
      }
      checkIndex(index);
      if (typeof index === "number") {
        index = checkArrayAccess(obj, index);
      }
      if (typeof index === "string" && typeof obj !== "object") {
        throw new TypeError(`Assignment failed, value is not an object (found "${typeof obj}")`);
      }
      switch (kind) {
        case "=":
          obj[index] = value;
          break;
        case "+=":
          obj[index] += value;
          break;
        case "-=":
          obj[index] -= value;
          break;
        default:
          throw new Error(`Invalid assignment kind: ${kind}`);
      }
    }
    __name(assign, "assign");
    function checkIndex(index) {
      if (typeof index !== "string" && typeof index !== "number") {
        throw new TypeError(`Index must be a string or number (found "${typeof index}")`);
      }
    }
    __name(checkIndex, "checkIndex");
    function checkArrayAccess(obj, index) {
      if (!Array.isArray(obj) && !Buffer.isBuffer(obj) && !(obj instanceof Uint8Array) && typeof obj !== "string") {
        throw new TypeError("Index is a number but collection is not an array or string");
      }
      if (index < 0 && index >= -obj.length) {
        index = obj.length + index;
      }
      if (index < 0 || index >= obj.length) {
        throw new RangeError(`Index ${index} out of bounds for array of length ${obj.length}`);
      }
      return index;
    }
    __name(checkArrayAccess, "checkArrayAccess");
    function isBytes(obj) {
      return typeof obj === "object" && obj !== null && obj._data instanceof Uint8Array;
    }
    __name(isBytes, "isBytes");
    function createExternRequire(dirname) {
      return (externPath) => {
        const jiti = eval("require('jiti')");
        const esbuild = eval("require('esbuild')");
        const newRequire = jiti(dirname, {
          sourceMaps: true,
          interopDefault: true,
          transform(opts) {
            return esbuild.transformSync(opts.source, {
              format: "cjs",
              target: "node20",
              sourcemap: "inline",
              loader: opts.ts ? "ts" : "js"
            });
          }
        });
        return newRequire(externPath);
      };
    }
    __name(createExternRequire, "createExternRequire");
    function resolve(outdir, relativeSourcePath) {
      return normalPath(path.resolve(outdir, relativeSourcePath));
    }
    __name(resolve, "resolve");
    function bringJs(moduleFile, outPreflightTypesObject) {
      return Object.fromEntries(Object.entries(require(moduleFile)).filter(([k, v]) => {
        if (k === "$preflightTypesMap") {
          Object.entries(v).forEach(([key, value]) => {
            const otherValue = outPreflightTypesObject[key];
            if (key in outPreflightTypesObject && otherValue !== value) {
              throw new Error(`Key collision (${key} is both ${value.name} and ${otherValue.name}) in preflight types map`);
            }
          });
          Object.assign(outPreflightTypesObject, v);
          return false;
        }
        return true;
      }));
    }
    __name(bringJs, "bringJs");
    function preflightClassSingleton(scope, typeId) {
      const root = nodeof(scope).root;
      const type = root.$preflightTypesMap[typeId];
      if (root.resourceSingletons === void 0) {
        root.resourceSingletons = {};
      }
      const instance = root.resourceSingletons[type];
      if (instance) {
        return instance;
      }
      root.resourceSingletons[type] = new type(scope, `${type.name}_singleton_${typeId}`);
      return root.resourceSingletons[type];
    }
    __name(preflightClassSingleton, "preflightClassSingleton");
    function loadEnvVariables(options) {
      const envDir = options?.cwd ?? process.cwd();
      const envFiles = [
        `.env`,
        `.env.local`,
        ...options?.modes.flatMap((mode) => [
          `.env.${mode}`,
          `.env.${mode}.local`
        ]) ?? []
      ].map((file) => path.join(envDir, file));
      const parsed = Object.fromEntries(envFiles.flatMap((file) => {
        try {
          return Object.entries((0, dotenv_1.parse)(node_fs_1.default.readFileSync(file)));
        } catch (_) {
          return [];
        }
      }));
      const expandedEnvVariables = (0, dotenv_expand_1.expand)({ parsed, ignoreProcessEnv: true });
      if (expandedEnvVariables.parsed) {
        for (const [key, value] of Object.entries(expandedEnvVariables.parsed)) {
          process.env[key] = value;
        }
      }
      return expandedEnvVariables.parsed;
    }
    __name(loadEnvVariables, "loadEnvVariables");
  }
});

// ../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/macros.js
var require_macros = __commonJS({
  "../../../../../../../opt/homebrew/lib/node_modules/winglang/node_modules/@winglang/sdk/lib/macros.js"(exports2) {
    exports2.__Array_at = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arr, index) => {
        if (index < 0 || index >= arr.length)
          throw new Error("Index out of bounds");
        return arr[index];
      })($self$, $args$);
    };
    exports2.__Array_tryAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.at($args$);
    };
    exports2.__Array_contains = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.includes($args$);
    };
    exports2.__Array_copyMut = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return [...$self$];
    };
    exports2.__Array_indexOf = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.indexOf($args$);
    };
    exports2.__Array_lastIndexOf = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.lastIndexOf($args$);
    };
    exports2.__Array_slice = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.slice(...$args$);
    };
    exports2.__MutArray_at = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arr, index) => {
        if (index < 0 || index >= arr.length)
          throw new Error("Index out of bounds");
        return arr[index];
      })($self$, $args$);
    };
    exports2.__MutArray_contains = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.includes($args$);
    };
    exports2.__MutArray_copy = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return [...$self$];
    };
    exports2.__MutArray_indexOf = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.indexOf($args$);
    };
    exports2.__MutArray_lastIndexOf = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.lastIndexOf($args$);
    };
    exports2.__MutArray_push = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.push(...$args$);
    };
    exports2.__MutArray_popAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, index) => {
        if (index < 0 || index >= $self$.length)
          throw new Error("Index out of bounds");
        return obj.splice(index, 1)[0];
      })($self$, $args$);
    };
    exports2.__MutArray_set = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, index, value) => {
        if (index < 0 || index >= $self$.length)
          throw new Error("Index out of bounds");
        obj[index] = value;
      })($self$, ...$args$);
    };
    exports2.__MutArray_insert = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, index, value) => {
        if (index < 0 || index > $self$.length)
          throw new Error("Index out of bounds");
        obj.splice(index, 0, value);
      })($self$, ...$args$);
    };
    exports2.__MutArray_removeFirst = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, index) => {
        if (obj.indexOf(index) !== -1) {
          obj.splice(obj.indexOf(index), 1);
          return true;
        }
        return false;
      })($self$, $args$);
    };
    exports2.__MutArray_slice = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.slice(...$args$);
    };
    exports2.__Json_keys = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.keys($args$);
    };
    exports2.__Json_values = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.values($args$);
    };
    exports2.__Json_delete = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((json, key) => {
        delete json[key];
      })(...$args$);
    };
    exports2.__Json_stringify = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((json, opts) => {
        return JSON.stringify(json, null, opts?.indent);
      })(...$args$);
    };
    exports2.__Json_deepCopy = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return JSON.parse(JSON.stringify($args$));
    };
    exports2.__Json_deepCopyMut = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return JSON.parse(JSON.stringify($args$));
    };
    exports2.__Json_parse = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return JSON.parse($args$);
    };
    exports2.__Json_tryParse = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((args) => {
        try {
          return args === void 0 ? void 0 : JSON.parse(args);
        } catch (err) {
          return void 0;
        }
      })($args$);
    };
    exports2.__Json_has = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key) => {
        return obj.hasOwnProperty(key);
      })($self$, $args$);
    };
    exports2.__Json_get = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, args) => {
        if (obj[args] === void 0)
          throw new Error(`Json property "${args}" does not exist`);
        return obj[args];
      })($self$, $args$);
    };
    exports2.__Json_getAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, args) => {
        if (obj[args] === void 0)
          throw new Error("Index out of bounds");
        return obj[args];
      })($self$, $args$);
    };
    exports2.__Json_tryGet = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__Json_tryGetAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__Json_asStr = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "string") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a string");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__Json_tryAsStr = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "string" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__Json_asNum = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "number") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a number");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__Json_tryAsNum = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "number" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__Json_asBool = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "boolean") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a boolean");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__Json_tryAsBool = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "boolean" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__MutJson_get = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, args) => {
        if (obj[args] === void 0)
          throw new Error(`Json property "${args}" does not exist`);
        return obj[args];
      })($self$, $args$);
    };
    exports2.__MutJson_getAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, args) => {
        if (obj[args] === void 0)
          throw new Error("Index out of bounds");
        return obj[args];
      })($self$, $args$);
    };
    exports2.__MutJson_set = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key, value) => {
        obj[key] = value;
      })($self$, ...$args$);
    };
    exports2.__MutJson_setAt = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, idx, value) => {
        obj[idx] = value;
      })($self$, ...$args$);
    };
    exports2.__MutJson_tryGet = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__MutJson_tryGetAt = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__MutJson_asStr = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "string") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a string");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__MutJson_tryAsStr = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "string" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__MutJson_asNum = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "number") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a number");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__MutJson_tryAsNum = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "number" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__MutJson_asBool = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        if (typeof arg !== "boolean") {
          throw new Error("unable to parse " + typeof arg + " " + arg + " as a boolean");
        }
        ;
        return JSON.parse(JSON.stringify(arg));
      })($self$);
    };
    exports2.__MutJson_tryAsBool = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((arg) => {
        return typeof arg === "boolean" ? JSON.parse(JSON.stringify(arg)) : void 0;
      })($self$);
    };
    exports2.__MutJson_delete = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return delete $self$[$args$];
    };
    exports2.__MutJson_has = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key) => {
        return obj?.hasOwnProperty(key);
      })($self$, $args$);
    };
    exports2.__Map_size = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.keys($self$).length;
    };
    exports2.__Map_get = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key) => {
        if (!(key in obj))
          throw new Error(`Map does not contain key: "${key}"`);
        return obj[key];
      })($self$, $args$);
    };
    exports2.__Map_tryGet = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__Map_has = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $args$ in $self$;
    };
    exports2.__Map_copyMut = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return { ...$self$ };
    };
    exports2.__Map_keys = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.keys($self$);
    };
    exports2.__Map_values = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.values($self$);
    };
    exports2.__Map_entries = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.entries($self$).map(([key, value]) => ({ key, value }));
    };
    exports2.__MutMap_size = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.keys($self$).length;
    };
    exports2.__MutMap_clear = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((map) => {
        for (const k in map) {
          delete map[k];
        }
        ;
      })($self$);
    };
    exports2.__MutMap_copy = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return { ...$self$ };
    };
    exports2.__MutMap_delete = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return delete $self$[$args$];
    };
    exports2.__MutMap_get = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key) => {
        if (!(key in obj))
          throw new Error(`MutMap does not contain key: "${key}"`);
        return obj[key];
      })($self$, $args$);
    };
    exports2.__MutMap_tryGet = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$?.[$args$];
    };
    exports2.__MutMap_has = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $args$ in $self$;
    };
    exports2.__MutMap_set = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((obj, key, value) => {
        obj[key] = value;
      })($self$, ...$args$);
    };
    exports2.__MutMap_keys = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.keys($self$);
    };
    exports2.__MutMap_values = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.values($self$);
    };
    exports2.__MutMap_entries = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return Object.entries($self$).map(([key, value]) => ({ key, value }));
    };
    exports2.__Number_fromStr = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((args) => {
        if (isNaN(args)) {
          throw new Error('unable to parse "' + args + '" as a number');
        }
        ;
        return Number(args);
      })($args$);
    };
    exports2.__Set_copyMut = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return new Set($self$);
    };
    exports2.__Set_toArray = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return [...$self$];
    };
    exports2.__MutSet_copy = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return new Set($self$);
    };
    exports2.__MutSet_toArray = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return [...$self$];
    };
    exports2.__String_at = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return ((args) => {
        if ($args$ >= $self$.length || $args$ + $self$.length < 0) {
          throw new Error("index out of bounds");
        }
        ;
        return $self$.at($args$);
      })($args$);
    };
    exports2.__String_contains = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.includes($args$);
    };
    exports2.__String_endsWith = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.endsWith($args$);
    };
    exports2.__String_indexOf = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.indexOf($args$);
    };
    exports2.__String_lowercase = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.toLocaleLowerCase();
    };
    exports2.__String_startsWith = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.startsWith($args$);
    };
    exports2.__String_replace = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.replace(...$args$);
    };
    exports2.__String_replaceAll = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.replaceAll(...$args$);
    };
    exports2.__String_uppercase = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$.toLocaleUpperCase();
    };
    exports2.__Struct_fromJson = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$._fromJson(...$args$);
    };
    exports2.__Struct_tryFromJson = (skipIfNil, $self$, ...$args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$._tryFromJson(...$args$);
    };
    exports2.__Struct_parseJson = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$._fromJson(JSON.parse($args$));
    };
    exports2.__Struct_tryParseJson = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$._tryParseJson($args$);
    };
    exports2.__Struct_schema = (skipIfNil, $self$, $args$) => {
      if (skipIfNil && $self$ === void 0)
        return $self$;
      return $self$;
    };
  }
});

// target/main.tfaws/.wing/inflight.$Closure1-1.cjs
var require_inflight_Closure1_1 = __commonJS({
  "target/main.tfaws/.wing/inflight.$Closure1-1.cjs"(exports2, module2) {
    "use strict";
    var $helpers = require_helpers();
    var $macros = require_macros();
    module2.exports = function({}) {
      class $Closure1 {
        static {
          __name(this, "$Closure1");
        }
        constructor($args) {
          const {} = $args;
          const $obj = /* @__PURE__ */ __name((...args) => this.handle(...args), "$obj");
          Object.setPrototypeOf($obj, this);
          return $obj;
        }
        async handle() {
          return "hello, world";
        }
      }
      return $Closure1;
    };
  }
});

// target/main.tfaws/.wing/function_c852aba6.cjs
var $handler = void 0;
exports.handler = async function(event, context) {
  try {
    if (globalThis.$awsLambdaContext === void 0) {
      globalThis.$awsLambdaContext = context;
      $handler = $handler ?? await (async () => {
        const klass = require_inflight_Closure1_1()({});
        const client = new klass({});
        if (client.$inflight_init) {
          await client.$inflight_init();
        }
        return client;
      })();
    } else {
      throw new Error(
        "An AWS Lambda context object was already defined."
      );
    }
    return await $handler.handle(event === null ? void 0 : event);
  } finally {
    globalThis.$awsLambdaContext = void 0;
  }
};
//# sourceMappingURL=index.cjs.map
