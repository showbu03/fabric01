#!/bin/bash

echo 'Create Channel..'

peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/channel.tx \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/cacerts/ca.example.com-cert.pem

echo 'Done'

echo 'Join Channel..'

CORE_PEER_ADDRESS=peer0.org1.example.com:7051 peer channel join -b mychannel.block

echo 'Done'
