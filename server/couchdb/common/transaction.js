import l from '../../common/logger';

function queryCouchDB(imDB, params) {
  const queryResult = {};
  /*
      http://localhost:5984/mychannel_im/_design/new-view/_view/new-view
  */

  if (params.logType == 'service') {
    params.key = 'imService';
  } else if (params.logType == 'contents') {
    params.key = 'imContents';
  } else if (params.logType == 'platform') {
    params.key = 'imLog';
  }

  /*
    1. 검색어가 있다면 데이터 뷰 Query 이전 Statistics view의 해당 검색어로 토탈카운트 집계
    2. 데이터 뷰에 해당 검색어로 Query
    3. 검색어는 Key 가 되어야 함
  */


  return imDB.view('data', params.key, { key: params.key, limit: params.limit, skip: params.offset }).then(body => {
    queryResult.total_rows = body.total_rows;
    queryResult.offset = body.offset;
    queryResult.data = body.rows;

    l.debug(JSON.stringify(queryResult));

    return queryResult;
  });

  /*
  return imDB.view('statistics', 'doc-count', { key: params.key, group: true }).then(body => {
    queryResult.total_cnt = body.rows;
    return params.key;
  }).then(key => {
    const viewName = key;

    return imDB.view('data', viewName, { key: params.key, limit: params.limit, skip: params.offset }).then(body => {
      queryResult.total_rows = body.total_rows;
      queryResult.offset = body.offset;
      queryResult.data = body.rows;

      l.debug(JSON.stringify(queryResult));

      return queryResult;
    });
  });
  */
}
module.exports.queryCouchDB = queryCouchDB;
