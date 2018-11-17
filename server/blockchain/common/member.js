import l from '../../common/logger';

const path = require('path');
const fs = require('fs-extra');

const CopService = require('fabric-ca-client/lib/FabricCAClientImpl.js');
const User = require('fabric-client/lib/User.js');


const tlsOptions = {
  trustedRoots: [],
  verify: false,
};

function register(caUrl, caName, registrar, userName, affiliation, role, enrollmentSecret) {
// enrollmentID, enrollmentSecret, role, affiliation, maxEnrollments, attr
//   log.debug(`register() => ${userName}`);

  const cop = new CopService(caUrl, tlsOptions, caName);

  return cop.register({
    enrollmentID: userName,
    enrollmentSecret: enrollmentSecret || undefined,
    role: role || 'client',
    affiliation: affiliation || 'org1.department1',
  }, registrar);
}
module.exports.register = register;


function enroll(client, caUrl, caName, userName, password, mspId) {
  l.debug(`enroll() => ${userName}`);

  const member = new User(userName);

  const cryptoSuite = client.getCryptoSuite();
  member.setCryptoSuite(cryptoSuite);

  const cop = new CopService(caUrl, tlsOptions, caName, cryptoSuite);

  return cop.enroll({
    enrollmentID: userName,
    enrollmentSecret: password,
  })
    .then(enrollment => {
      l.info(`Successfully enrolled user '${userName}'`);
      return member.setEnrollment(enrollment.key, enrollment.certificate, mspId);
    })
    .then(() => client.setUserContext(member, false))
    .catch(err => {
      l.error(`Failed to enroll and persist user. Error: ${err.stack ? err.stack : err}`);
      return Promise.reject(err);
    });
}
module.exports.enroll = enroll;


function getCurrentContextMember(client) {
  const currentContextMember = client.getUserContext();
  if (currentContextMember) {
    return currentContextMember;
  }
  throw new Error('현재 Client Context에 지정된 Member가 없습니다.');
}
module.exports.getCurrentContextMember = getCurrentContextMember;


function getMember(client, userName) {
  l.debug(`getMember() => ${userName}`);

  if (!client) return Promise.reject(new Error('해당 명령을 처리할 클라이언트 멤버가 존재하지 않습니다.'));

  return client.getUserContext(userName, true)
    .then(user => new Promise((resolve, reject) => {
      if (user && user.isEnrolled()) {
        // log.info('Successfully loaded member from persistence');
        resolve(user);
      } else {
        reject('Failed to get Member');
      }
    }));
}
module.exports.getMember = getMember;


function createMember(client, params) {
  return client.getUserContext(params.memberId, true)
    .then(user => new Promise((resolve, reject) => {
      if (user && user.isEnrolled()) {
        l.info('Successfully loaded member from persistence');
        return resolve(user);
      }
      const keyPath = path.join(params.adminKeyPath);
      const keyPEM = Buffer.from(readAllFiles(`server/blockchain/${keyPath}`)[0]).toString();
      const certPath = path.join(params.adminCertPath);
      const certPEM = readAllFiles(`server/blockchain/${certPath}`)[0];

      return resolve(client.createUser({
        username: params.memberId,
        mspid: params.mspId,
        cryptoContent: {
          privateKeyPEM: keyPEM.toString(),
          signedCertPEM: certPEM.toString(),
        },
      }));
    }))
    .catch(err => Promise.reject(new Error(`Failed to create member form cert : ${err}`)));
}
module.exports.createMember = createMember;


function readAllFiles(dir) {
  const files = fs.readdirSync(dir);
  const certs = [];
  files.forEach(file_name => {
    const file_path = path.join(dir, file_name);
    // log.debug(` looking at file ::${file_path}`);
    const data = fs.readFileSync(file_path);
    certs.push(data);
  });
  return certs;
}
