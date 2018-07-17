#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _argufy = _interopRequireDefault(require("argufy"));

var _pedantry = _interopRequireDefault(require("pedantry"));

var _util = require("util");

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
  push: _push
} = (0, _argufy.default)({
  source: {
    command: true
  },
  toc: {
    short: 't',
    boolean: true
  },
  watch: {
    short: 'w',
    boolean: true
  },
  output: 'o',
  push: {
    short: 'p'
  }
});

if (process.argv.find(a => a == '-p') && !_push) {
  console.log('Please specify a commit message.');
  process.exit(1);
}

const doc = async (source, output, justToc = false) => {
  if (!source) {
    console.log('Please specify an input file.'); // print usage

    process.exit(1);
  }

  const ls = (0, _fs.lstatSync)(source);
  let stream;

  if (ls.isDirectory()) {
    stream = new _pedantry.default(source);
  } else if (ls.isFile()) {
    stream = (0, _fs.createReadStream)(source);
  }

  await (0, _run.default)(stream, output, justToc);
};

(async () => {
  try {
    await doc(_source, _output, _toc);
  } catch ({
    stack,
    message,
    code
  }) {
    if (code == 'ENOENT') {
      console.log('File %s does not exist.', _source);
      process.exit(2);
    }

    DEBUG ? LOG(stack) : console.log(message);
  }

  let debounce = false;

  if (_watch || _push) {
    (0, _fs.watch)(_source, {
      recursive: true
    }, async () => {
      if (!debounce) {
        debounce = true;
        await doc(_source, _output, _toc);

        if (_push) {
          console.log('Pushing documentation changes');
          await gitPush(_source, _output, _push);
        }

        setTimeout(() => {
          debounce = false;
        }, 100);
      }
    });
  }
})();

const gitPush = async (source, output, message) => {
  const {
    promise
  } = (0, _spawncommand.default)('git', ['log', '--format=%B', '-n', '1']);
  const {
    stdout
  } = await promise;
  const s = stdout.trim();

  if (s == message) {
    await git('reset', 'HEAD~1');
  }

  await git('add', source, output);
  await git('commit', '-m', message);
  await git('push', '-f');
};

const git = async (...args) => {
  const {
    promise
  } = (0, _spawncommand.default)('git', args, {
    stdio: 'inherit'
  });
  await promise;
};
//# sourceMappingURL=index.js.map