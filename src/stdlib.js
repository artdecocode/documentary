import write from '@wrote/write'
import read from '@wrote/read'
import rexml from 'rexml'
import argufy, { reduceUsage } from 'argufy'
import Catchment, { collect } from 'catchment'
import clearr from 'clearr'
// import competent from 'competent'
import erte, { c, b } from 'erte'
import forkfeed from 'forkfeed'
import makepromise from 'makepromise'
import mismatch from 'mismatch'
import usually from 'usually'
import resolveDependency from 'resolve-dependency'
import spawn, { fork } from 'spawncommand'
import {
  SyncReplaceable, Replaceable, makeMarkers, makeCutRule, makePasteRule,
  replace,
} from 'restream'

module.exports = {
  'c': c,
  'b': b,
  'read': read,
  'replace': replace,
  'usually': usually,
  'spawn': spawn,
  'fork': fork,
  'SyncReplaceable': SyncReplaceable, 
  'Replaceable': Replaceable, 
  'makeMarkers': makeMarkers, 
  'makeCutRule': makeCutRule, 
  'makePasteRule': makePasteRule,
  'resolveDependency': resolveDependency,
  'rexml': rexml,
  'reduceUsage': reduceUsage,
  'write': write,
  'argufy': argufy,
  'Catchment': Catchment,
  'collect': collect,
  'clearr': clearr,
  // 'competent': competent,
  'erte': erte,
  'forkfeed': forkfeed,
  'makepromise': makepromise,
  'mismatch': mismatch,
}