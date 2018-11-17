#!/usr/bin/env bash

#체인코드
docker exec cli /opt/gopath/src/github.com/hyperledger/fabric/peer/cli/setup-chaincode.sh $1 $2
