"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeInitialRule = exports.makeRule = exports.makeMarkers = void 0;

/**
 * Make a unique marker for replacements.
 * @param {string} name
 */
const docMarker = (prefix, index) => {
  return `${prefix}-${index}`;
};

const getPrefix = name => {
  const d = Date.now();
  return `%%_DOCUMENTARY_${name.toUpperCase()}_REPLACEMENT_${d}_%%`;
};
/**
 * Create a new marker
 * @param {string} matcher name of the matcher, used in the doc marker.
 * @param {RegExp} re a regular expression used for detection
 * @return {Marker} A marker
 */


const makeMarker = (matcher, re) => {
  const prefix = getPrefix(matcher);
  const regExp = new RegExp(`${prefix}-(\\d+)`, 'g');
  return {
    re,
    regExp,
    map: {},

    getMarker(index) {
      return docMarker(prefix, index);
    },

    lastIndex: 0
  };
};
/**
 * Make markers from configuration object.
 * @param {Object.<string, RegExp>} matchers An object with types of markers to create as keys and their detection regexes as values.
 * @returns {Object.<string, Marker>} An object with markers for each requested type.
 */


const makeMarkers = matchers => {
  const res = Object.keys(matchers).reduce((acc, key) => {
    const re = matchers[key];
    const marker = makeMarker(key, re);
    const m = { ...acc,
      [key]: marker
    };
    return m;
  }, {});
  return res;
};
/**
 * Make a rule for replacing markers backwards
 * @param {Marker} marker
 */


exports.makeMarkers = makeMarkers;

const makeRule = marker => {
  const {
    regExp: re,
    map
  } = marker;
  const rule = {
    re,

    replacement(match, index) {
      const m = map[index];
      delete map[index];
      return m;
    }

  };
  return rule;
};
/**
 * Make a rule for replacing markers backwards
 * @param {Marker} marker
 */


exports.makeRule = makeRule;

const makeInitialRule = marker => {
  const {
    re,
    map,
    getMarker
  } = marker;
  const rule = {
    re,

    replacement(match) {
      const {
        lastIndex
      } = marker;
      map[lastIndex] = match;
      marker.lastIndex += 1;
      const m = getMarker(lastIndex);
      return m;
    }

  };
  return rule;
};
/**
 * A marker
 * @typedef {Object} Marker
 * @property {(index) => string} getMarker a function to generate markers which can be then found.
 * @property {RegExp} re the regular expression used for detection of the match
 * @property {RegExp} regExp regex to replace the marker back to its original value
 * @property {object} map a map which holds the detected matches at their indexes.
 * @property {number} lastIndex An index of last inserted element. Starts with 0.
 */
// * @property {string} marker a string used to replace the original match
// * @property {string[]} array an array of matches where matches should be pushed upon detection


exports.makeInitialRule = makeInitialRule;
//# sourceMappingURL=markers.js.map