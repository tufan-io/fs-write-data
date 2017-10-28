
import * as engchk from 'runtime-engine-check';
engchk(); // checks node version matches spec in package.json

import * as mkdirp from 'mkdirp';
import * as YAML from 'js-yaml';
import * as tomlify from 'tomlify-j0.4';
import * as ini from 'ini';
import * as fs from 'fs';
import * as path from 'path';
import * as a from 'awaiting';
import * as _ from 'lodash';

const fileToWrite = (fname, ext) => {
  ext = ext ? ext.replace(/^\./, '') : null;
  if (fname) {
    const p = path.parse(fname);
    ext = ext || p.ext.replace(/^\./, '');
    fname = path.join(p.dir, `${p.name}.${ext}`);
  }
  return { fname, ext };
};

/**
 * Serializes `data` using appropriate serializer and write to file or returns a string.
 *
 * Serializers used:
 *     [js-yaml](https://www.npmjs.com/package/js-yaml)
 *     [ini](https://www.npmjs.com/package/ini)
 *     [tomlify](https://www.npmjs.com/package/tomlify-j0.4)
 *
 * @param fname file to write to. Extension is used as hint for format. If missing, returns a string.
 * @param data the JavaScript object to serialize
 * @param ext serialization format. Overrides file extension
 * @param opts options to the individual serializers - expects a JSON object.
 */
export const writeFile = async (
  fname: string,
  data: object,
  ext: string = null,
  opts: object = {}
) => {
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
    mkdirp(dir);
    await a.callback(fs.writeFile, fname, output, 'utf8');
  } else {
    return output;
  }
};
