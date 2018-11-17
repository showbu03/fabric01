import l from '../../common/logger';

const util = require('util');

const member = require('./member.js');
const channelLib = require('./channel.js');

function format_query_resp(peer_responses) {
  const ret = {
    parsed: null,
    peers_agree: true,
    peer_payloads: [],
    error: null,
  };
  let last = null;

  // -- iter on each peer's response -- //
  for (const i in peer_responses) {
    const as_string = peer_responses[i].toString('utf8');
    let as_obj = {};
    ret.peer_payloads.push(as_string);

    // -- compare peer responses -- //
    if (last != null) {									// check if all peers agree
      if (last !== as_string) {
        logger.warn('[fcw] warning - some peers do not agree on query', last, as_string);
        ret.peers_agree = false;
      }
      last = as_string;
    }

    try {
      if (as_string === '') {							// if its empty, thats okay... well its not great
        as_obj = '';
      } else {
        as_obj = JSON.parse(as_string);				// if we can parse it, its great
      }
      if (ret.parsed === null) ret.parsed = as_obj;	// store the first one here
    } catch (e) {
      l.error(e.toString());
      if (known_sdk_errors(as_string)) {
        ret.parsed = null;
        ret.error = as_string;
      } else if (as_string.indexOf('premature execution') >= 0) {
        ret.parsed = null;
        ret.error = as_string;
      } else {
        ret.parsed = as_string;
      }
    }
  }
  return ret;
}

function known_sdk_errors(str) {
  const known_errors = ['Error: failed to obtain', 'Error: Connect Failed'];		//list of known sdk errors from a query
  for (let i in known_errors) {
    if (str && str.indexOf(known_errors[i]) >= 0) {
      return true;
    }
  }
  return false;
}

function queryChaincode(client, channelName, req, targets) {
  l.debug(`queryChaincode(${req.chaincodeId}, ${req.fcn}, [${req.args}])`);
  l.info(`Query Targets : ${targets}`);

  return new Promise(((resolve, reject) => {
    const invoker = member.getCurrentContextMember(client);
    l.info(`Member '${invoker.getName()}' try to query ~`);

    const channel = client.getChannel(channelName);
    const tx_id = client.newTransactionID();

    // send query
    const request = {
      chaincodeId: req.chaincodeId,
      txId: tx_id,
      fcn: req.fcn,
      args: req.args ? req.args : [],
    };

    if (targets && targets.length != 0) {
      request.targets = targets;
    }

    return channel.queryByChaincode(request)
      .then(response_payloads => {
        if (response_payloads) {
          const result = [];
          for (let i = 0; i < response_payloads.length; i++) {
            result.push((response_payloads[i] instanceof Error) ? response_payloads : format_query_resp(response_payloads));
            l.info(response_payloads);
          }
          resolve(result);
        } else {
          l.error('Failed to get response on query - response_payloads is null');
          reject(new Error('Failed to get response on query - response_payloads is null'));
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          l.error(`Failed to query. ${err.stack ? err.stack : err}`);
          reject(err);
        } else {
          l.error(`Failed to query - ${err}` ? err : 'No Error Info');
          reject(new Error(`Failed to query - ${err}` ? err : 'No Error Info'));
        }
      });
  }));
}
module.exports.queryChaincode = queryChaincode;

function invokeChaincode(client, channelName, req, targets, eventhubs) {
  l.debug(`invokeChaincode(${req.chaincodeId}, ${req.fcn}, [${req.args}])`);
  l.info(`Invoke Targets : ${targets}`);

  return new Promise(((resolve, reject) => {
    const invoker = member.getCurrentContextMember(client);
    l.info(`Member '${invoker.getName()}' try to invoke ~`);

    const channel = client.getChannel(channelName);
    let tx_id;

    tx_id = client.newTransactionID();
    l.info(util.format('Sending transaction "%s"', JSON.stringify(tx_id._transaction_id)));

    // send proposal to endorser
    const request = {
      chaincodeId: req.chaincodeId,
      fcn: req.fcn,
      args: req.args,
      txId: tx_id,
    };

    if (targets && targets.length != 0) {
      request.targets = targets;
    }

    return channel.sendTransactionProposal(request)
      .then(results => {
        const proposalResponses = results[0];
        const proposal = results[1];
        const header = results[2];
        let errorResponse;

        for (const i in proposalResponses) {
          if (proposalResponses[i] && proposalResponses[i].response
            && proposalResponses[i].response.status === 200) {
            l.info('transaction proposal has response status of good');
            if (channel.verifyProposalResponse(proposalResponses[i])) {
              l.info(' - transaction proposal signature and endorser are valid');
            } else {
              errorResponse = new Error('transaction proposal signature and endorser are invalid!');
            }
          } else {
            l.error(`transaction proposal was bad : ${proposalResponses[i]}`);
            errorResponse = (proposalResponses[i] instanceof Error)
              ? proposalResponses[i].response.message : new Error(proposalResponses[i].response.message);
          }
        }
        if (!errorResponse) {
          if (channel.compareProposalResponseResults(proposalResponses)) {
            l.info('compareProposalResponseResults exection did not throw');
            l.info(' All proposals have a matching read/writes sets');
          } else {
            l.error(' All proposals do not have matching read/write sets');
            errorResponse = new Error('proposals do not have matching read/write sets');
          }
        }
        if (!errorResponse) {
          l.info(util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
          const request = {
            proposalResponses,
            proposal,
            header,
          };

          const deployId = tx_id.getTransactionID();

          const eventPromises = [];
          eventhubs.forEach(eh => {
            if (eh.isconnected()) {
              const txPromise = new Promise((resolve, reject) => {
                const handle = setTimeout(() => {
                  l.debug('eventhub time out');
                  eh.unregisterTxEvent(deployId);
                  reject(new Error('eventhub time out'));
                }, 60000);

                eh.registerTxEvent(deployId.toString(),
                  (tx, code) => {
                    clearTimeout(handle);
                    eh.unregisterTxEvent(deployId);

                    if (code !== 'VALID') {
                      l.error(`The transaction was invalid, code = ${code}`);
                      reject(new Error(`The transaction was invalid, code = ${code} on peer ${eh.getPeerAddr()}`));
                    } else {
                      l.info('The transaction was valid.');
                      l.info(`The transaction has been committed on peer ${eh.getPeerAddr()}`);
                      resolve();
                    }
                  },
                  err => {
                    clearTimeout(handle);
                    l.info(`Eventhub is shutdown for ${deployId} err : ${err}`);
                    reject(new Error(`Eventhub is shutdown for ${deployId} err : ${err}`));
                  });
              });
              eventPromises.push(txPromise);
            }
          });

          const sendPromise = channel.sendTransaction(request)
            .catch(err => {
              l.error('지정된 Orderer에 연결이 불가능합니다. ');
              channelLib.loadChannelConfig(channel)
                .catch(err => {
                  l.info(err);
                });
              //   return Promise.reject(err);
              throw err;
            });

          return Promise.all([sendPromise].concat(eventPromises))
            .then(results => {
              l.debug('Event promise all complete and testing complete');
              return results[0]; // just first results are from orderer, the rest are from the peer events
            }).catch(err => {
              if (err && err instanceof Error) {
                l.error(`Failed to send transaction - ${err}`);
                throw err;
              } else {
                l.error(`Failed to send transaction - ${err || 'Failed to get notifications within the timeout period'}`);
                throw new Error(`Failed to send transaction - ${err || 'Failed to get notifications within the timeout period'}`);
              }
            });
        }
        l.error(errorResponse);
        throw errorResponse;
      })
      .then(response => {
        if (!(response instanceof Error) && response.status === 'SUCCESS') {
          l.info(JSON.stringify(response));
          l.info('Successfully sent transaction to the orderer.');
          l.info('******************************************************************');
          l.info(`${'export TX_ID=' + '\''}${tx_id.getTransactionID()}'`);
          l.info('******************************************************************');
          resolve(`${'TX_ID=' + '\''}${tx_id.getTransactionID()}'`);
        } else if (response instanceof Error) {
          l.error(`Failed to the transaction. ${response.stack ? response.stack : response}`);
          reject(response);
        } else {
          l.error(`Failed to order the transaction - ${response || 'No Error Info'}`);
          reject(new Error(`Failed to order the transaction - ${response || 'No Error Info'}`));
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          l.error(`Failed to transaction. ${err.stack ? err.stack : err}`);
          reject(err);
        } else {
          l.error(`Failed to send transaction - ${err || 'No Error Info'}`);
          reject(new Error(`Failed to send transaction - ${err || 'No Error Info'}`));
        }
      });
  }));
}
module.exports.invokeChaincode = invokeChaincode;
