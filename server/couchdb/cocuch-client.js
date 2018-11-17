import l from '../common/logger';

const transaction = require('./common/transaction.js');

class CouchClient {
  constructor() {
    // CouchDB Client
    this._couch = require('nano')('http://localhost:5984');
    this._imdb = null;
  }

  dbSetUp() {
    this._imdb = this._couch.use('mychannel_im');
  }

  queryCouchDB(params) {
    return transaction.queryCouchDB(this._imdb, params);
  }
}

const couchClient = new CouchClient();
module.exports = couchClient;
