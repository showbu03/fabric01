import l from '../../common/logger';
import db from './examples.db.service';

const fbClient = require('../../blockchain/bc-client');

class ExamplesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  test(req, res) {
    l.info(`${this.constructor.name}.all()`);
    const args = [];
    args.push(req.query.Id);
    args.push(req.query.Name);
    args.push(req.query.Age);
    args.push(req.query.Sex);
    // return Promise.resolve("hello world");
    return Promise.resolve(fbClient.invokeChaincode('balance', 'saveUser', args, []));
  }

  byId(id) {
    l.debug('hello world!!!!');
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(name) {
    return db.insert(name);
  }
}

export default new ExamplesService();
