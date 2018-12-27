# Hyperledger Fabric 개발환경 

## Ubuntu 환경설정
1. virtualbox에 18.04 설치
    * download : https://www.ubuntu.com/download/server/thank-you?country=KR&version=18.04.1&architecture=amd64
2. 공유폴더 설정
    * 이름 : share 생성
    * VM VirtualBox의 상단 메뉴 "장치"-> 게스트 확장 CD 이미지 삽입 
    <pre>
    터미널에서 
    sudo apt-get install build-essential linux-headers-$(uname -r)
    sudo apt-get install virtualbox-guest-additions-iso
    sudo apt-get install --reinstall linux-image-$(uname -r)
    sudo mount /dev/cdrom /mnt
    cd /mnt
    sudo ./VBoxLinuxAdditions.run
    sudo reboot
    sudo mkdir -p /usr/shared
    sudo mount -t vboxsf share /usr/shared
    </pre>
3. 인증서 복사 (SSL 인증서 문제로 Docker설치시 오류난 경우)
* 아래와 같은 오류가 발생할 경우
<pre>
curl: (60) SSL certificate problem: self signed certificate in certificate chain
More details here: https://curl.haxx.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.      
</pre>

      * C:\Windows\Temp\ㅁㅁㅁ.crt 복사 -> 공유폴더(share)에 붙여넣기
      * sudo cp ㅁㅁㅁ.crt /usr/share/ca-certificates/
      * sudo cp ㅁㅁㅁ.crt /usr/local/share/ca-certificates/
      * sudo update-ca-certificates

## Fabric 환경 구축
1. Docker CE, Docker-Compose 설치
      * https://docs.docker.com/install/linux/docker-ce/ubuntu
      * https://docs.docker.com/compose/install
      * If you would like to use Docker as a non-root user, you should now consider adding your user to the “docker” group with something like   :  sudo usermod -aG docker your-user
2. golang 설치
      * sudo apt-get -y upgrade
      * wget https://storage.googleapis.com/golang/go1.11.2.linux-amd64.tar.gz
      * sudo tar -xvf go1.11.2.linux-amd64.tar.gz
      * sudo mv go /usr/local
      * 환경변수 셋팅
         * $vi ~/.profile
         * export GOROOT=/usr/local/go
         * export GOPATH=$HOME/workspace
         * export PATH="$PATH:$GOROOT/bin:$GOPATH/bin"
         * source ~/.profile
         * go env (환경변수 확인)
3. IntelliJ 설치
      * https://www.jetbrains.com/idea/download/#section=linux
4. nvm 설치
      * curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
      * source ~/.bashrc
      * nvm install 8
      * nvm install 6
      * nvm use 8
      
5. 기타 개발 도구 설치
      * apt-get install -y python-pip
      * apt-get install -y git
      * apt-get install -y curl
      * apt-get install -y libltdl-dev
      * apt-get install -y tree
      * apt-get install -y net-tools
      * apt-get install -y openssh-server
      


# Application Run
## 사전 필요 사항 ##
* nodeJS v8.11.3 이상
* Docker 17.12.1-ce 이상
* HLF 1.2 Image
* yo (npm install -g yo generator-express-no-stress) 

## HLF 기반 Simple Balance API 개발 환경 구성
* 개발 소스 clone
```
$)cd ~/workspace/src #홈디렉토리로 이동
$)mkdir github.com
$)git clone https://github.com/showbu03/fabric01.git
```
* nodeJS 모듈 설치
```
$)cd ~/github.com/fabric01
$)npm install
```
* npm install시 인증서 오류 발생시 조치 방법
<pre>
export NODE_TLS_REJECT_UNAUTHORIZED='0'
npm set strict-ssl false
npm set registry http://registry.npmjs.org
npm set python python2.7
npm set ca ""
</pre>

### HLF Basic 네트워크 구동

* 기존컨테이너 삭제
```
$) docker rm -f $(docker ps -aq)
```

* 네트워크구동
```
$)cd ~/workspace/src/github.com/fabric01/tools/network
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
$)cd ~/workspace/src/github.com/fabric01/tools/chaincodes
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
$)cd ~/workspace/src/github.com/fabric01
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
