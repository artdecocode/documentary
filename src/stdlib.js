import '@externs/preact/types/externs'
import write from '@wrote/write'
import read from '@wrote/read'
import clone from '@wrote/clone'
import ensurePath, { ensurePathSync } from '@wrote/ensure-path'
import readDirStructure from '@wrote/read-dir-structure'
import rexml from 'rexml'
import argufy, { reduceUsage } from 'argufy'
import Catchment, { collect } from 'catchment'
import clearr from 'clearr'
import competent from 'competent'
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
import Pedantry from 'pedantry'
import compare from '@depack/cache'
import whichStream from 'which-stream'

module.exports = {
  'competent': competent,
  'c': c,
  'b': b,
  'readDirStructure': readDirStructure,
  'clone': clone,
  'Pedantry': Pedantry,
  'whichStream': whichStream,
  'compare': compare,
  'ensurePath': ensurePath,
  'ensurePathSync': ensurePathSync,
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
  'erte': erte,
  'forkfeed': forkfeed,
  'makepromise': makepromise,
  'mismatch': mismatch,
}