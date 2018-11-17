#!/bin/bash

export FABRIC_CFG_PATH=$PWD

#genesis.block 파일이 생성 될 channel-artifacts 디렉토리를 생성한다.
mkdir ./channel-artifacts

#orderer genesis block: 프로필에 지정된 이름은 configtx.yaml 의 "OrdererGenesisProfile" 이다.
./bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block

#channel configuration transaction: 프로필에 지정된 이름은 configtx.yaml의 "ChannelProfile" 이다.
./bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID im_channel

#two anchor peer transactions - one for each Peer Org.
./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID im_channel -asOrg Org1MSP

#two anchor peer transactions - one for each Peer Org.
./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID im_channel -asOrg Org2MSP
