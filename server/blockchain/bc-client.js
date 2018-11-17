/* eslint-disable prefer-destructuring */
import l from '../common/logger';

const HFC = require('fabric-client');
const fs = require('fs');
const path = require('path');
const env = require('./utils/env.js');

const member = require('./common/member.js');
const channel = require('./common/channel.js');
const transaction = require('./common/transaction.js');

class BcClient {
  constructor() {
    // HFC
    this._hfc = null;

    // Connected Peers
    this._connectedPeers = null;
    this._eventPeers = null;

    // Loaded Config Files
    this._clientConfig = null;
    this._channelConfig = null;

    // Client Setting
    this._clientOrgId = null;
    this._channelConfigDirPath = null;
  }

  channelSetUp(chConfigDirPath) {
    try {
      this._hfc = new HFC();

      /* eslint-disable global-require */
      /*
      * 각 ORG 별 Admin Certification
      * crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore
      * crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts
      */
      this._clientConfig = require(`../blockchain/${chConfigDirPath}/settings`);

      /*
       * Hyperledger Fabric Network Topology
       */
      this._channelConfig = require(`../blockchain/${chConfigDirPath}/channelConfig`);
      /* eslint-enable global-require */

      this._channelConfigDirPath = chConfigDirPath;

      // Client type 설정 (Admin, User)
      this._isAdmin = this._clientConfig.default.adminClient;

      // 타임아웃 설정
      HFC.setConfigSetting('request-timeout', 180000);
    } catch (err) {
      return Promise.reject(new Error(`설정 파일 로드 오류 : ${err.stack ? err.stack : err}`));
    }

    return this.setChannelNetwork(this._hfc)
      .then(() => this.setClientOrg(this._clientConfig.default.org))
      .then(() => this.setClientType())
      .then(() => this.setConnectedPeers())
      .then(() => this.setClientMember(this._clientConfig.default.member))
      .catch(err => Promise.reject(err));
  }

  setChannelNetwork(hfc) {
    try {
      const mychannel = hfc.newChannel(this._channelConfig.channelName);
      const orderers = this._channelConfig.orderer;

      for (const ordererId in orderers) {
        const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, orderers[ordererId].tls_cacerts)}`);
        const opts = {
          pem: Buffer.from(pemData).toString(),
          'ssl-target-name-override': orderers[ordererId]['server-hostname'],
        };

        const orderer = hfc.newOrderer(orderers[ordererId].url, opts);
        mychannel.addOrderer(orderer);

        l.info(`chain addOrderer : ${ordererId} - ${orderers[ordererId].mspid} added`);
      }

      const orgs = this._channelConfig.orgs;
      for (const orgId in orgs) {
        if (orgs.hasOwnProperty(orgId)) {
          l.info(`chain addPeer : ${orgId} - ${orgs[orgId].name} added`);
          const peers = orgs[orgId].peers;
          for (const peerId in peers) {
            if (peers.hasOwnProperty(peerId)) {
              const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
              const opts = {
                pem: Buffer.from(pemData).toString(),
                'ssl-target-name-override': peers[peerId]['server-hostname'],
              };
              const peer = hfc.newPeer(peers[peerId].requests, opts);
              l.info(`${'chain addPeer : ' + '  '}${peer} added`);
              mychannel.addPeer(peer);
            }
          }
        }
      }
      return Promise.resolve(hfc);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  setClientOrg(orgId, hfc) {
    if (!this._channelConfig.orgs[orgId]) return Promise.reject(new Error(`Channel Client Org가 존재하지 않습니다. clientOrgId: ${orgId}`));

    if (!hfc) {
      hfc = this._hfc;
      this._clientOrgId = orgId;
    }
    const orgName = this._channelConfig.orgs[orgId].name;

    return HFC.newDefaultKeyValueStore({
      path: env.getKeyValStorePathForOrg(this._channelConfigDirPath, orgName),
    }).then(store => {
      l.info(`keyValStore Path : ${store._dir}`);
      hfc.setStateStore(store);
      return HFC.newCryptoKeyStore({
        path: env.getCryptoKeyStorePathForOrg(
          this._channelConfigDirPath, orgName,
        ),
      });
    }).then(cryptoKeyStore => {
      const cryptoSuite = HFC.newCryptoSuite();
      cryptoSuite.setCryptoKeyStore(cryptoKeyStore);
      hfc.setCryptoSuite(cryptoSuite);
      return Promise.resolve();
    });
  }

  setClientType() {
    if (this._isAdmin) {
      return this.createMemberFromCert(this._clientConfig.adminCertPath
        ? this._clientConfig.adminCertPath[this._clientOrgId] : undefined,
      this._channelConfig.orgs[this._clientOrgId].mspid)
        .catch(err => Promise.reject(new Error(`Admin Mode인 경우 지정된 Org에 대한 Admin 계정이 등록되어야 합니다 - ${err}`)))
        .then(() => this.devCreateOtherOrgAdmins())
        .then(() => this.devCreatePreDefinedRegistrarMembers());
    }
    return Promise.resolve();
  }

  createMemberFromCert(memberInfo, mspId, client) {
    try {
      if (!memberInfo) throw new Error('해당 멤버에 대한 계정정보(인증서, 키)가 존재하지 않습니다.');
      const params = {
        memberId: memberInfo.member,
        adminKeyPath: path.join(this._channelConfigDirPath, memberInfo.key),
        adminCertPath: path.join(this._channelConfigDirPath, memberInfo.cert),
        mspId,
      };
      if (!client) client = this._hfc;
      return member.createMember(client, params);
    } catch (err) {
      return Promise.reject(new Error(`Failed to create member form cert : ${err}`));
    }
  }

  // only in dev mode
  devCreateOtherOrgAdmins() {
    this.devOtherAdminClients = {};
    const adminCertPath = this._clientConfig.adminCertPath;

    if (adminCertPath && Object.keys(adminCertPath).length > 0) {
      return this.devCreateNextAdminMember(0, adminCertPath)
        .catch(err => {
          l.info(`다른 Admin Member 등록 중 오류가 발생하였습니다. ${err}`);
        });
    }
    return Promise.resolve('Admin Member 정보가 없습니다.');
  }

  // only in dev mode
  devCreateNextAdminMember(idx, list) {
    if (idx > (Object.keys(list).length) - 1) {
      return Promise.resolve();
    }
    const orgId = Object.keys(list)[idx];

    if (orgId == this._clientOrgId) {
      return this.devCreateNextAdminMember(idx + 1, list);
    }

    const otherAdminClient = new HFC();

    return this.setChannelNetwork(otherAdminClient)
      .then(() => this.setClientOrg(orgId, otherAdminClient)).then(() => {
        l.debug(`mspid : ${this._channelConfig.orgs[orgId].mspid}`);
        return this.createMemberFromCert(list[orgId], this._channelConfig.orgs[orgId].mspid,
          otherAdminClient);
      })
      .then(() => {
        this.devOtherAdminClients[orgId] = otherAdminClient;
        return this.devCreateNextAdminMember(idx + 1, list);
      });
  }

  // only in dev mode
  devCreatePreDefinedRegistrarMembers() {
    this.devRegistrarClients = {};
    const registrarList = this._clientConfig.registrar;

    if (registrarList && Object.keys(registrarList).length > 0) {
      return this.devCreateNextRegistrarMember(0, registrarList)
        .catch(err => {
          l.info(`registrar 등록 중 오류가 발생하였습니다. ${err}`);
        });
    }
    return Promise.resolve('registrar 정보가 없습니다.');
  }

  // only in dev mode
  devCreateNextRegistrarMember(idx, list) {
    if (idx > (Object.keys(list).length) - 1) {
      return Promise.resolve();
    }
    const orgId = Object.keys(list)[idx];

    const client = new HFC();
    const ca = this._channelConfig.orgs[orgId].ca;
    const mspId = this._channelConfig.orgs[orgId].mspid;

    return this.setClientOrg(orgId, client)
      .then(() => member.enroll(client, ca.url, ca.name, list[orgId].name,
        list[orgId].password, mspId))
      .then(user => {
        l.info(`${orgId} registrar '${user.getName()}' 등록 완료.`);
        this.devRegistrarClients[orgId] = client;
        return this.devCreateNextRegistrarMember(idx + 1, list);
      });
  }

  getTargetPeers(targetPeers) {
    let targets = [];

    if (targetPeers) {
      for (const orgId in targetPeers) {
        const peerList = this._connectedPeers[orgId];
        for (const idx in targetPeers[orgId]) {
          targets.push(peerList[targetPeers[orgId][idx]]);
        }
      }
    } else {
      targets = targetPeers;
    }

    return targets;
  }

  eventPeerDisconnection() {
    if (this._eventPeers) {
      this._eventPeers.forEach(eh => {
        if (eh.isconnected()) eh.disconnect();
      });
    }
    this._eventPeers = [];
  }

  setConnectedPeers() {
    try {
      this._connectedPeers = {};

      const orgs = this._channelConfig.orgs;
      for (const orgId in orgs) {
        const targets = {};
        const peers = orgs[orgId].peers;
        for (const peerId in peers) {
          const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
          const opts = {
            pem: Buffer.from(pemData).toString(),
            'ssl-target-name-override': peers[peerId]['server-hostname'],
          };
          const peer = this._hfc.newPeer(peers[peerId].requests, opts);
          targets[peerId] = peer;
        }
        if (targets) {
          this._connectedPeers[orgId] = targets;
        }
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  setEventPeer() {
    try {
      this.eventPeerDisconnection();

      const peers = this._channelConfig.orgs[this._clientOrgId].peers;
      for (const peerId in peers) {
        const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
        const opts = {
          pem: Buffer.from(pemData).toString(),
          'ssl-target-name-override': peers[peerId]['server-hostname'],
        };

        const eh = this._hfc.newEventHub();
        eh.setPeerAddr(peers[peerId].events, opts);
        eh.connect();
        eh.peerId = peerId;
        this._eventPeers.push(eh);
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  loadChannelConfig() {
    const channelName = this._channelConfig.channelName;
    return channel.loadChannelConfig(this._hfc.getChannel(channelName))
      .then(result => {
        const curOrderer = this._hfc.getChannel(channelName).getOrderers()[0];
        this.devSetNewOrdererToAllOtherAdminClients(curOrderer, channelName);
        return Promise.resolve(result);
      });
  }

  devSetNewOrdererToAllOtherAdminClients(curOrderer, channelName) {
    for (const orgId in this._devOtherAdminClients) {
      const ch = this._devOtherAdminClients[orgId].getChannel(channelName);
      const orderers = ch.getOrderers();
      for (let i = 0; i < orderers.length; i++) {
        if (orderers[0].getUrl() === curOrderer.getUrl()) {
          if (i > 0) {
            log.info(`${orgId}의 Admin 클라이언트의 디폴트 orderer를 ${curOrderer.getUrl()}으로 변경합니다.`);
          }
          break;
        } else {
          orderers.push(orderers.shift());
        }
      }
    }
  }

  setClientMember(name, fabricClient) {
    const client = fabricClient || this._hfc;
    return member.getMember(client, name)
      .then(user => {
        l.info('====================================================');
        l.info(`${user.getName()} 멤버를 Client Context에 설정하였습니다.`);
        l.info('====================================================');

        if (fabricClient) {
          return Promise.resolve();
        }
        return this.setEventPeer()
          .then(() => this.loadChannelConfig()
            .catch(err => {
              l.error(`${err} Channel Config Load 실패! Load Channel Config를 다시 실행해야 합니다.`);
            }));
      })
      .catch(err => {
        if (this._eventPeers) {
          this._eventPeers.forEach(eh => {
            if (eh.isconnected()) eh.disconnect();
          });
        }
        this._eventPeers = [];
        this._hfc._userContext = null;
        l.error(err);
        return Promise.reject(err);
      });
  }

  queryChaincode(id, fcn, args, targetPeers) {
    const channelName = this._channelConfig.channelName;
    const req = {
      chaincodeId: id,
      fcn,
      args,
    };
    return transaction.queryChaincode(this._hfc, channelName,
      req, this.getTargetPeers(targetPeers));
  }

  invokeChaincode(id, fcn, args, targetPeers) {
    const channelName = this._channelConfig.channelName;
    const req = {
      chaincodeId: id,
      fcn,
      args,
    };
    return transaction.invokeChaincode(this._hfc, channelName,
      req, this.getTargetPeers(targetPeers), this._eventPeers);
  }
}

const bcClient = new BcClient();
module.exports = bcClient;
