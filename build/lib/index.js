"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLink = void 0;

const getLink = title => {
  const l = title.replace(/<br\/>/g, '').replace(/&nbsp;/g, '').replace(/[^\w-\d ]/g, '').toLowerCase().replace(/[, ]/g, '-');
  return l;
};

exports.getLink = getLink;
//# sourceMappingURL=index.js.map