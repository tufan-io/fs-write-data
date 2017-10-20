
import { test } from 'ava';
import { writeFile } from '../..';
import * as tmp from 'tmp';
import * as path from 'path';
import * as fs from 'fs';
import * as a from 'awaiting';
import * as execa from 'execa';

const fixdir = path.resolve('src/test/fixtures');
const tmpdir = tmp.dirSync().name;

const rawRead = fname => a.callback(fs.readFile, fname, 'utf8');

const input = {
  name: 'fs-read-data',
  description: 'make it easy to read files of multiple types'
};

for (let ext of ['json', 'yml', 'yaml', 'toml', 'ini']) {
  test(`fs-write-data API ${ext}`, async t => {
    const out_file = path.join(tmpdir, `data.${ext}`);
    const exp_file = path.join(fixdir, `data.${ext}`);

    await writeFile(out_file, input);
    const expected = await rawRead(exp_file);
    const actual = await rawRead(out_file);
    // console.log(out_file);
    t.is(actual, expected, out_file);
  });
}

test(`fs-write-data API invalid extension`, async t => {
  const out_file = path.join(tmpdir, 'data.xyz');
  const err = await t.throws(writeFile(out_file, input));
  t.regex(err.message, /Unsupported output format xyz/, out_file);
});

test(`fs-write-data API invalid extension override`, async t => {
  const out_file = path.join(tmpdir, 'data.json');
  const err = await t.throws(writeFile(out_file, input, 'xyz'));
  t.regex(err.message, /Unsupported output format xyz/, out_file);
});


const expected = [
  '{',
  '  "name": "fs-read-data",',
  '  "description": "make it easy to read files of multiple types"',
  '}'
].join('\n');

test(`fs-write-data CLI`, async (t) => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-i',
      'src/test/fixtures/data.json'
    ]);
  t.is(result.stdout, expected, result);
});

const utf8Read = async fname => a.callback(fs.readFile, fname, 'utf8');

test(`fs-write-data CLI in_file->out_file`, async (t) => {
  const in_file = 'src/test/fixtures/data.json';
  const exp_file = 'src/test/fixtures/data.json';
  const out_file = path.join(tmpdir, 'cli-file2file.json');
  await execa(
    'node',
    [
      'build/cli.js',
      '-i',
      in_file,
      '-o',
      out_file
    ]);
  t.is(await utf8Read(out_file), await utf8Read(exp_file), out_file);
});

test(`fs-write-data CLI file->stdout`, async (t) => {
  const in_file = 'src/test/fixtures/data.json';
  const exp_file = 'src/test/fixtures/data.json';
  const out_file = path.join(tmpdir, 'cli-file2stdout.json');
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-i',
      in_file
    ]);
  t.is(result.stdout, await utf8Read(exp_file), result);
});

test(`fs-write-data CLI stdin->file`, async (t) => {
  const in_file = 'src/test/fixtures/data.json';
  const exp_file = 'src/test/fixtures/data.yaml';
  const out_file = path.join(tmpdir, 'cli-stdin2file.yaml');
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      '{ "noRefs": true, "noCompatMode": true }',
      '-o',
      out_file
    ], { input: expected }
  );
  t.is(await utf8Read(out_file), await utf8Read(exp_file), out_file);
});

test(`fs-write-data CLI file.yaml->stdout: error`, async (t) => {
  const in_file = 'src/test/fixtures/data.yaml';
  const exp_file = 'src/test/fixtures/data.json';
  const out_file = path.join(tmpdir, 'cli-file2stdout.json');
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-i',
      in_file
    ]);
  t.regex(result.stderr, /Only JSON input is supported. Given:.*/, result);
});

test(`fs-write-data CLI stdin.yaml->stdout: error`, async (t) => {
  const in_file = 'src/test/fixtures/data.yaml';
  const exp_file = 'src/test/fixtures/data.yaml';
  const out_file = path.join(tmpdir, 'cli-stdin2file.yaml');
  const result = await execa(
    'node',
    [
      'build/cli.js'
    ], { input: await a.callback(fs.readFile, in_file, 'utf8') }
  );
  t.regex(result.stderr, /Only JSON input is supported. Given:.*/, result);
});


test(`fs-write-data CLI invalid serializer options`, async (t) => {
  const in_file = 'src/test/fixtures/data.json';
  const exp_file = 'src/test/fixtures/data.yaml';
  const out_file = path.join(tmpdir, 'cli-stdin2file.yaml');
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'noRefs=true, noCompatMode: true'
    ], { input: expected }
  );
  t.regex(result.stderr, /Expected --options to be a parseable JSON string. Got.*/, result);
});
