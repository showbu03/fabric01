const path = require('path');
const fs = require('fs-extra');

// directory for file based KeyValueStore
exports.getKeyValStorePathForOrg = function (channelPath, org) {
  return path.join(channelPath, 'key', `${'keyValStore' + '_'}${org}`);
};

exports.getCryptoKeyStorePathForOrg = function (channelPath, org) {
  return path.join(channelPath, 'key', `${'cryptoKeyStore' + '_'}${org}`);
};

exports.getAdminMemberIdForOrg = function (org) {
  return `${org}Admin`;
};

// temporarily set $GOPATH to the test fixture folder
exports.setGoPath = function (gopath) {
  process.env.GOPATH = path.join(gopath);
};

exports.getGoPath = function () {
  return path.join(process.env.GOPATH, 'src');
};

// targetPeers format => {org1 : [peer1, peer2, ...], org2 : [peer1, ...], ...}
exports.setTargets = function (allPeers, targetPeers) {
  const targets = [];
  for (const orgId in targetPeers) {
    const peerList = allPeers[orgId];
    for (const idx in targetPeers[orgId]) {
      targets.push(peerList[targetPeers[orgId][idx]][0]);
    }
  }
};

// targetPeers format => {org1 : [peer1, peer2, ...], org2 : [peer1, ...], ...}
exports.setEventhubs = function (allPeers, targetPeers, clientOrg) {
  const eventhubs = [];
  const ehPeerList = allPeers[clientOrgId];
  for (const idx in ehPeerList) {
    const eh = client.newEventHub();
    eh.setPeerAddr(ehPeerList[idx][1], ehPeerList[idx][2]);
    eh.connect();
    eventhubs.push(eh);
  }

  return eventhubs;
};

// specifically set the values to defaults because they may have been overridden when
// running in the overall test bucket ('gulp test')
exports.resetDefaults = function () {
  global.hfc.config = undefined;
  require('nconf').reset();
};

exports.cleanupDir = function (keyValStorePath) {
  const absPath = path.join(process.cwd(), keyValStorePath);
  const exists = exports.existsSync(absPath);

  if (exists) {
    fs.removeSync(absPath);
  }
};

exports.getUniqueVersion = function (prefix) {
  if (!prefix) prefix = 'v';
  return prefix + Date.now();
};

// utility function to check if directory or file exists
// uses entire / absolute path from root
exports.existsSync = function (absolutePath /* string */) {
  try {
    const stat = fs.statSync(absolutePath);
    if (stat.isDirectory() || stat.isFile()) {
      return true;
    } return false;
  } catch (e) {
    return false;
  }
};
