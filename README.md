# FastCampus HLF 2기 
## 사전 필요 사항 ##
* nodeJS v8.11.3 이상
* Docker 17.12.1-ce 이상
* HLF 1.2 Image
* yo (npm install -g yo generator-express-no-stress) 

## HLF 기반 Simple Balance API 개발 환경 구성
* 개발 소스 clone
```
$)cd ~ #홈디렉토리로 이동
$)mkdir github
$)git clone https://github.com/simon0210/hyperledger-study02.git
```
* nodeJS 모듈 설치
```
$)cd ~/github/hyperledger-study02
$)npm install
```

### HLF Basic 네트워크 구동

* 기존컨테이너 삭제
```
$) docker rm -f $(docker ps -aq)
```

* 네트워크구동
```
$)cd ~/github/hyperledger-study02/tools/network
$)./0-network-start.sh
```

* 채널 생성 및 조인
```
$)./1-create-channel.sh
```
* 체인코드 Install & Instantiate balance는 체인코드 ID 이며 0.1 은 버전명을 의미한다.
```
$)./2-setup-chaincode.sh balance 0.1
```
주의할점은 체인코드 ID를 balance에서 다른것으로 바꾸면 안된다. 해당 쉘 스크립트는  

```
$)cd ~/github/hyperledger-study02/tools/chaincodes
$)ls -al

drwxr-xr-x 3 simon simon 4096  9월 15 10:07 .
drwxr-xr-x 5 simon simon 4096  9월 15 10:07 ..
drwxr-xr-x 2 simon simon 4096  9월 15 18:46 balance_cc
```
상기디렉토리의 balance_cc 를 바라본다. 

다른 체인코드를 install & instantiate 하기 위해서는 example_cc 디렉토리를 생성하고 id를 example 로 주면 된다

(ex: ./2-setup-chaincode.sh example 0.1)

### API 서버 구동
* npm run dev 명령으로 API 서버를 구동한다.
```
$)cd /home/simon/github/hyperledger-study02
$)npm run dev
```

### Swagger 접속
http://localhost:3500/api-explorer/

### CouchDB 메니지먼트 
http://localhost:5984/_utils

## Fabric Download
```
$)go get -u github.com/hyperledger/fabric
$)cd $GOPATH/src/github.com/hyperledger/fabric/examples/events/block-listener
$)go build .
```
빌드한 바이너리 파일을 복사한다
```
$)cp -rf ./block-listener $HOME/github/hyperledger-study02/tools/network/event
```
## Event Client
https://github.com/hyperledger/fabric/tree/release-1.2/examples/events/block-listener

### Block listener
```
$)cd ~/github/hyperledger-study02/tools/network/event
$)./block-listener -events-address=127.0.0.1:7053 -events-mspdir=../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -events-mspid=Org1MSP
(window 인 경우)
$)./block-listener.exe -events-address=127.0.0.1:7053 -events-mspdir=../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp -events-mspid=Org1MSP

```
## Fabric Build
```
$)cd $GOPATH/src/github.com/hyperledger/fabric
$)make docker
$)make native
```

## GO Vendor
https://sabzil.org/govendor/

## Go Application
```
cp -rf ~/github/hyperledger-study02 $GOPATH/src/github.com/
```
https://github.com/hyperledger/fabric/tree/master/core/chaincode/lib/cid
