# fs-write-data

<!-- badge -->
[![npm license](https://img.shields.io/npm/l/fs-write-data.svg)](https://www.npmjs.com/package/fs-write-data)
[![travis status](https://img.shields.io/travis/tufan-io/fs-write-data.svg)](https://travis-ci.org/tufan-io/fs-write-data)
[![Build status](https://ci.appveyor.com/api/projects/status/90am2usst4qeutgi?svg=true)](https://ci.appveyor.com/project/tufan-io/fs-write-data)
[![Coverage Status](https://coveralls.io/repos/github/tufan-io/fs-write-data/badge.svg?branch=master)](https://coveralls.io/github/tufan-io/fs-write-data?branch=master)
[![David](https://david-dm.org/tufan-io/fs-write-data/status.svg)](https://david-dm.org/tufan-io/fs-write-data)
[![David](https://david-dm.org/tufan-io/fs-write-data/dev-status.svg)](https://david-dm.org/tufan-io/fs-write-data?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![NPM](https://nodei.co/npm/fs-write-data.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fs-write-data/)
<!-- endbadge -->

Converts input JSON to one of multiple output formats {json, yaml, ini, toml}.

Provides a CLI and API interface to underlying capability, making conversion of
data-formats a breeze, especially when coupled with [fs-read-data](https://github.com/tufan-io/fs-read-data)

## Why

It's common to have data files in one of multiple well-known formats - sometimes
just for config, sometimes for more sophisticated declarative definitions.

This is a tool to help you work with such files without getting in your way.

Great for file format conversions or reformatting of input files.

Compared to a single spurious bable module installation, this additional weight
of multiple file-serializers was considered acceptable collateral-weight.

## Installation

```bash
npm install fs-write-data
```

```base
yarn install fs-write-data
```

## Usage

### CLI

```bash

  Usage: write-data [options]

  reads JSON from input/stdin and writes to fname/stdout


  Options:

    -V, --version            output the version number
    -x, --format <format>    output format {json, yaml, ini, toml}
    -i, --input <input>      input file, else reads from stdin
    -o, --output <output>    output file, else write to stdout
    -p, --options <options>  options to the underlying serializers, as stringified JSON
    -h, --help               output usage information
```

#### Use cases

Coupled with `fs-read-data`, it's reasonable trivial to achieve file format conversions.

```bash
# yaml to ini conversion
npx read-data ./data.yaml | npx write-data ./data.ini

# json formatting
npx read-data ./data.json > ./data.json

# yaml formatting
npx read-data ./data.yaml | npx write-data ./data.yaml

```

### API

```javascript
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
```

```javascript

const write = require('fs-write-data');

# file format determined from extension
write(`/path/to/file/data.yaml`, data);
write(`/path/to/file/data.ini`, data);
write(`/path/to/file/data.yml`, data);
write(`/path/to/file/data.toml`, data);
write(`/path/to/file/data.json`, data);

# file format explicitly specified - overrides file extension.
# NOTE: the command will write `/path/to/file.data.ini`
write(`/path/to/file/data.yaml`, data, 'ini');

```

## Development Tooling

- [Development tooling](./docs/DevTools.md)
- [Changelog](./CHANGELOG.md)

## Related

[fs-read-data](https://github.com/tufan-io/fs-read-data)

### Dependencies

This is an aggregation module, much like [fs-extra](https://npmjs.org/package/fs-extra).
It's built upon the shoulders of libraries that provide it's core functionality.

[js-yaml](https://www.npmjs.com/package/js-yaml)
[ini](https://www.npmjs.com/package/ini)
[tomlify](https://www.npmjs.com/package/tomlify-j0.4)

Support cast:
[awaiting](https://www.npmjs.com/package/awaiting)
[commander](https://www.npmjs.com/package/commander)

## License

[Apache-2.0](LICENSE)

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

## Support

Bugs, PRs, comments, suggestions welcomed!
