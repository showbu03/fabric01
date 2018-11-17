import l from '../../../common/logger';

const fbClient = require('../../../blockchain/bc-client');

class BalanceService {
  getBalance(req, res) {
    const args = [];

    args.push(req.params.id);
    return Promise.resolve(fbClient.queryChaincode('balance', 'query', args, []));
  }

  move(req, res) {
    l.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.from);
    args.push(req.body.to);
    args.push(req.body.amount.toString());

    return Promise.resolve(fbClient.invokeChaincode('balance', 'move', args, []));
  }

  addUser(req, res) {
    l.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.name);
    args.push(req.body.balance.toString());

    return Promise.resolve(fbClient.invokeChaincode('balance', 'add', args, []));
  }
}

export default new BalanceService();
