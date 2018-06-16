"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDirStream;

var _path = require("path");

var _fs = require("fs");

var _stream = require("stream");

const readFile = (path, name) => {
  const p = (0, _path.resolve)(path, name);
  const rs = (0, _fs.createReadStream)(p);
  return rs;
};

const hasFile = (array, file) => {
  return array.some(a => a == file);
};

const processDir = async (stream, path, content) => {
  const k = Object.keys(content);
  const hasIndex = hasFile(k, 'index.md');
  const hasFooter = hasFile(k, 'footer.md');
  const keys = [...(hasIndex ? ['index.md'] : []), ...k.filter(a => !['index.md', 'footer.md'].includes(a)).sort(), ...(hasFooter ? ['footer.md'] : [])];
  await keys.reduce(async (acc, name) => {
    await acc;
    const {
      type,
      content: dirContent
    } = content[name];

    if (type == 'File') {
      await new Promise((r, j) => {
        const rs = readFile(path, name);
        rs.pipe(stream, {
          end: false
        });
        rs.on('close', () => {
          r();
        });
        rs.on('error', j);
      });
    } else if (type == 'Directory') {
      await processDir(stream, (0, _path.resolve)(path, name), dirContent);
    }
  }, {});
};

const p = async (stream, ...args) => {
  await processDir(stream, ...args);
  stream.end();
};

function createDirStream(source, content) {
  const stream = new _stream.PassThrough();
  p(stream, source, content);
  return stream;
}
//# sourceMappingURL=dir-stream.js.map