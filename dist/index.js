"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const engchk = require("runtime-engine-check");
engchk();
const mkdirp = require("mkdirp");
const YAML = require("js-yaml");
const tomlify = require("tomlify-j0.4");
const ini = require("ini");
const fs = require("fs");
const path = require("path");
const a = require("awaiting");
const _ = require("lodash");
const fileToWrite = (fname, ext) => {
    ext = ext ? ext.replace(/^\./, '') : null;
    if (fname) {
        const p = path.parse(fname);
        ext = ext || p.ext.replace(/^\./, '');
        fname = path.join(p.dir, `${p.name}.${ext}`);
    }
    return { fname, ext };
};
exports.writeFile = (fname, data, ext = null, opts = {}) => __awaiter(this, void 0, void 0, function* () {
    const out = fileToWrite(fname, ext);
    let output = null;
    switch (out.ext) {
        case 'json': {
            output = JSON.stringify(data, null, 2);
            break;
        }
        case 'yaml':
        case 'yml': {
            opts = _.merge({ noRefs: true, noCompatMode: true }, opts);
            output = YAML.safeDump(data, opts);
            break;
        }
        case 'toml': {
            output = tomlify.toToml(data);
            break;
        }
        case 'ini': {
            output = ini.stringify(data, opts);
            break;
        }
        default:
            throw new Error(`Unsupported output format ${out.ext}`);
    }
    if (fname) {
        const dir = path.dirname(fname);
        yield a.callback(mkdirp, dir);
        yield a.callback(fs.writeFile, fname, output, 'utf8');
    }
    else {
        return output;
    }
});
