#!/usr/bin/env node
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
const fs = require("fs");
const path = require("path");
const a = require("awaiting");
const program = require("commander");
const readline = require("readline");
const chalk_1 = require("chalk");
const _1 = require(".");
const pkg = require('../package.json');
const readStdin = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let input = [];
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.prompt();
        rl.on('line', line => input.push(line));
        rl.on('close', () => {
            let allInput = null;
            try {
                allInput = input.join('\n');
                const json = JSON.parse(allInput);
                resolve(json);
            }
            catch (err) {
                reject(new Error(`Only JSON input is supported. Given:\n${allInput}`));
            }
        });
    });
});
const readJsonFile = (fname) => __awaiter(this, void 0, void 0, function* () {
    let raw = null;
    try {
        raw = yield a.callback(fs.readFile, fname, 'utf8');
        return JSON.parse(raw);
    }
    catch (err) {
        throw new Error(`Only JSON input is supported. Given:\n${raw}`);
    }
});
const getFormat = (fname, ext) => {
    const p = fname ? path.parse(fname) : { ext: null };
    return p.ext === null ? 'json' : p.ext.replace(/^\./, '');
};
const getSerOpts = (serOpts) => {
    try {
        const opts = serOpts || '{}';
        return JSON.parse(opts);
    }
    catch (err) {
        throw new Error(`Expected --options to be a parseable JSON string. Got ${serOpts}`);
    }
};
program
    .version(pkg.version)
    .description(`reads input/stdin and writes to \'output/stdout\'\n\n` +
    `   Depends on these serializers:\n` +
    `     js-yaml - https://www.npmjs.com/package/js-yaml \n` +
    `     ini     - https://www.npmjs.com/package/ini\n` +
    `     tomlify - https://www.npmjs.com/package/tomlify-j0.4\n` +
    `\n` +
    `    --options are JSON.parse() before being passed to these\n`)
    .option('-f, --format <format>', 'output format {json, yaml, ini, toml}', null)
    .option('-i, --input <input>', 'input file, else reads from stdin', null)
    .option('-o, --output <output>', 'output file, else write to stdout', null)
    .option('-s, --serializer-opts <serOpts>', 'options to the underlying serializers, as stringified JSON')
    .parse(process.argv);
const p = new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
    try {
        const input = program.input
            ? yield readJsonFile(program.input)
            : yield readStdin();
        const format = getFormat(program.output, program.format);
        const options = getSerOpts(program.serializerOpts);
        const output = yield _1.writeFile(program.output, input, format, options);
        if (!program.output) {
            console.log(output);
        }
        resolve();
    }
    catch (err) {
        console.error(chalk_1.default.red(err.message));
        console.error(chalk_1.default.red(err.stack));
    }
}));
