const utils = require('fabric-client/lib/utils.js');

const logger = utils.getLogger('E2E install-chaincode');

const tape = require('tape');
const _test = require('tape-promise').default;

const test = _test(tape);

const e2eUtils = require('./e2eUtils.js');
const testUtil = require('./util.js');

const version = 'v0';

test('\n\n***** End-to-end flow: chaincode install *****\n\n', t => {
  testUtil.setupChaincodeDeploy();

  e2eUtils.installChaincode('org1', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true)
    .then(() => {
      t.pass('Successfully installed chaincode in peers of organization "org1"');
      return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
    }, err => {
      t.fail(`Failed to install chaincode in peers of organization "org1". ${err.stack}` ? err.stack : err);
      logger.error('Failed to install chaincode in peers of organization "org1". ');
      return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
    }).then(() => {
      t.pass('Successfully installed chaincode in peers of organization "org2"');
      t.end();
    }, err => {
      t.fail(`Failed to install chaincode in peers of organization "org2". ${err.stack}` ? err.stack : err);
      logger.error('Failed to install chaincode in peers of organization "org2". ');
      t.end();
    }).catch(err => {
      t.fail(`Test failed due to unexpected reasons. ${err.stack}` ? err.stack : err);
      t.end();
    });
});
