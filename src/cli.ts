#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as a from 'awaiting';
import * as program from 'commander';
import * as readline from 'readline';
import chalk from 'chalk';
import { writeFile } from '.';

const pkg = require('../package.json');
const readStdin = async () => {
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
      } catch (err) {
        reject(new Error(`Only JSON input is supported. Given:\n${allInput}`));
      }
    });
  });
};

const readJsonFile = async (fname) => {
  let raw = null;
  try {
    raw = await a.callback(fs.readFile, fname, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Only JSON input is supported. Given:\n${raw}`);
  }
};

const getFormat = (fname, ext) => {
  const p = fname ? path.parse(fname) : { ext: null };
  return p.ext === null ? 'json' : p.ext.replace(/^\./, '');
};

const getSerOpts = (serOpts) => {
  try {
    const opts = serOpts || '{}';
    return JSON.parse(opts);
  } catch (err) {
    throw new Error(`Expected --options to be a parseable JSON string. Got ${serOpts}`);
  }
};


program
  .version(pkg.version)
  .description(
  `reads input/stdin and writes to \'output/stdout\'\n\n` +
  `   Depends on these serializers:\n` +
  `     js-yaml - https://www.npmjs.com/package/js-yaml \n` +
  `     ini     - https://www.npmjs.com/package/ini\n` +
  `     tomlify - https://www.npmjs.com/package/tomlify-j0.4\n` +
  `\n` +
  `    --options are JSON.parse() before being passed to these\n`
  )
  .option('-f, --format <format>', 'output format {json, yaml, ini, toml}', null)
  .option('-i, --input <input>', 'input file, else reads from stdin', null)
  .option('-o, --output <output>', 'output file, else write to stdout', null)
  .option('-s, --serializer-opts <serOpts>', 'options to the underlying serializers, as stringified JSON')
  .parse(process.argv);

const p = new Promise(async (resolve) => {
  try {
    const input = program.input
      ? await readJsonFile(program.input)
      : await readStdin();
    const format = getFormat(program.output, program.format);
    const options = getSerOpts(program.serializerOpts);
    const output = await writeFile(program.output, input, format, options);
    if (!program.output) {
      console.log(output);
    }
    resolve();
  } catch (err) {
    console.error(chalk.red(err.message));
    console.error(chalk.red(err.stack));
  }
});
