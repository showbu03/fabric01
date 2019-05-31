# Hyperledger Fabric 환경변수들

## **hyperledger/fabric-tools**

### 기본 환경변수

* GOPATH : GOPATH 설정
* CORE\_VM\_ENDPOINT : Docker 데몬 주소
* CORE\_LOGGING\_LEVEL : 로그 메시지 표시 수준 설정 \(INFO/DEBUG\)

### PEER 환경변수

* CORE\_PEER\_ID : peer를 식별하는 ID
* CORE\_PEER\_ADDRESS : peer의 주소 값
* CORE\_PEER\_LOCALMSPID : peer의 Local MSP ID
* CORE\_PEER\_TLS\_ENABLED : TLS 통신 활성화 여부 \(true/false\)
* CORE\_PEER\_TLS\_CERT\_FILE : peer의 TLS 서버 인증서 파일 경로
* CORE\_PEER\_TLS\_KEY\_FILE : peer의 TLS 서버 개인키가 저장된 경로
* CORE\_PEER\_TLS\_ROOTCERT\_FILE : peer의 TLS 서버 인증서를 발급한 CA의 인증서 파일 경로 \(해당 Org의 msp/cacert 디렉터리 내에 존재하는 cert.pem 파일과 동일\)
* CORE\_PEER\_MSPCONFIGPATH : peer의 MSP 파일 경로 \(Peer 컨테이너에는 peers/해당피어/msp인데 cli 컨테이너에서는 users/Admin@해당org/msp로 설정됨 -&gt; 일부러?상관없음?\)

## hyperledger/fabric-orderer

### 기본 환경변수

* ORDERER\_GENERAL\_LOGLEVEL : 로그 메시지 표시 수준 설정 \(INFO/DEBUG\)
* ORDERER\_GENERAL\_LISTENADDRESS : orderer의 주소 값
* ORDERER\_GENERAL\_GENESISMETHOD : 제네시스 블록을 지정하는 방법 \(file/provisional\)
* ORDERER\_GENERAL\_GENESISFILE : 제네시스 블록 경로
* ORDERER\_GENERAL\_LOCALMSPID : 해당 orderer의 Local MSP ID
* ORDERER\_GENERAL\_LOCALMSPDIR : 해당 orderer의 Local MSP 경로
* ORDERER\_GENERAL\_TLS\_ENABLED : TLS 통신 활성화 여부 \(true/false\)
* ORDERER\_GENERAL\_TLS\_PRIVATEKEY : 해당 orderer의 TLS 서버 개인키가 저장된 경로
* ORDERER\_GENERAL\_TLS\_CERTIFICATE : 해당 orderer의 TLS 서버 인증서 파일 경로
* ORDERER\_GENERAL\_TLS\_ROOTCAS : 해당 orderer의 TLS 서버 인증서를 발급한 CA의 인증서 파일 경로
* ORDERER\_GENERAL\_LEDGERTYPE : Orderer 노드의 원장 유형 \(file/ram/json\)

### Configtx 환경변수

* CONFIGTX\_ORDERER\_ORDERERTYPE : Orderer에서 트랜잭션을 정렬하는 방식 지정 \(solo/kafka\)
* CONFIGTX\_ORDERER\_ADDRESSES : Orderer 노드의 주소
* CONFIGTX\_ORDERER\_KAFKA\_BROKERS : kafka 브로커 노드 목록
* 
### Kafka 환경변수

* ORDERER\_KAFKA\_RETRY\_SHORTINTERVAL : 재시도 수행 간격 \(default: 1분\)
* ORDERER\_KAFKA\_RETRY\_SHORTTOTAL  재시도 수행 기간 \(default: 10분\)
* ORDERER\_KAFKA\_VERBOSE : 세부 정보 표시 모드
* file : 운영환경용. 블록을 파일 시스템에 직접 저장. 디스크의 블록 위치는 Lightweight LevelDB 데이터베이스에서 번호로 '인덱싱'되어 클라이언트가 효율적으로 번호별 블록 검색이 가능. \(default\)
* ram : 개발환경용. 메모리에 배치를 보존하고 구성 가능한 히스토리 크기를 보존. 프로세스를 다시 시작하면 원장이 기성 블록으로 재설정됨
* json : 개발환경용. JSON 인코딩 파일로 파일 시스템에 일괄 처리를 저장. 원장을 쉽게 검사하고 충돌 방지 기능을 허용하기 위한 것

### ※ Orderer 노드의 원장 유형

* file : 운영환경용. 블록을 파일 시스템에 직접 저장. 디스크의 블록 위치는 Lightweight LevelDB 데이터베이스에서 번호로 '인덱싱'되어 클라이언트가 효율적으로 번호별 블록 검색이 가능. \(default\)
* ram : 개발환경용. 메모리에 배치를 보존하고 구성 가능한 히스토리 크기를 보존. 프로세스를 다시 시작하면 원장이 기성 블록으로 재설정됨
* json : 개발환경용. JSON 인코딩 파일로 파일 시스템에 일괄 처리를 저장. 원장을 쉽게 검사하고 충돌 방지 기능을 허용하기 위한 것

## hyperledger/fabric-peer

{% hint style="info" %}
core.yaml은 하이퍼레저 패브릭 CLI 기본 설정 파일입니다.  
\(peer 명령 설정 파일\)
{% endhint %}

{% hint style="info" %}
peer 컨테이너 정보 확인 방법!

docker inspect peer0.org1.example.com \| grep -e IPAddress -e MSPID
{% endhint %}

### VM 환경변수

* CORE\_VM\_ENDPOINT : Docker 데몬 주소
* CORE\_VM\_DOCKER\_HOSTCONFIG\_NETWORKMODE : 컨테이너의 네트워크 모드 설정
* CORE\_LOGGING\_LEVEL : 로그 메시지 표시 수준 설정 \(INFO/DEBUG\)

### PEER 환경변수

| 환경변수 | 설명 |
| :--- | :--- |
| FABRIC\_CFG\_PATH | 패브릭 관련 설정 파일을\(core.yaml 등\) 배치할 경로 지정 |
| CORE\_PEER\_ID | peer를 식별하는 ID |
| CORE\_PEER\_ADDRESS  | 피어 노드의 주소와 포트 번호를 지정. 예\)172.18.0.5:7051 |
| CORE\_PEER\_LOCALMSPID  | 인증서 검증 등 질의를 할때 MSP의 ID 지정 |
| CORE\_PEER\_MSPCONFIGPATH | 각종 인증서가 저장될 디렉토리 경로를 지정 |
| CORE\_LOGGING\_LEVEL | 로그 레벨 지정 |
| CORE\_PEER\_GOSSIP\_EXTERNALENDPOINT  | peer에서 발생하는 모든 외부 통신에 대한 endpoint 또는 주소 \(이 값이 설정되지 않으면 해당 peer에 대한 endpoint 정보가 다른 ORG의 peer에게 broadcasting되지 않으며, 자신의 ORG에게만 알려짐\) |
| CORE\_PEER\_GOSSIP\_BOOTSTRAP  | 앵커 peer의 endpoint 및 주소. 앵커 peer가 아닌 peer에 설정. \(ORG 내에서 gossip을 시작하기 위해 사용. 공백으로 구분된 peer 목록으로 지정 가능. peer가 부트스트랩 peer에 접속하면 endpoint 정보를 전달한 다음 ORG의 모든 peer에 대한 정보를 ORG의 peer들에게 배포하는 데 gossip이 사용됨.\) |
| CORE\_PEER\_GOSSIP\_USELEADERELECTION | Gossip 프로토콜의 리더 선출 방법 \(true:자동/false:수동\) |
| CORE\_PEER\_GOSSIP\_ORGLEADER | 해당 peer의 리더 여부 \(true/false\) \(CORE\_PEER\_GOSSIP\_USELEADERELECTION 값을 true로 설정한 경우에는 false로 지정 필요\) |
| CORE\_PEER\_PROFILE\_ENABLED |  peer profile 서버의 사용 여부 \(true/false\) \(peer profile 서버 : peer 컨테이너의 CPU 최적화 등을 담당. Go 프로그램 프로파일링 기능에서 지원\) |
| CORE\_PEER\_ENDORSER\_ENABLED | peer의 Endorsing peer 역할 여부 결 |

### TLS 환경변수

* CORE\_PEER\_TLS\_ENABLED : TLS 통신 활성화 여부 \(true/false\)
* CORE\_PEER\_TLS\_CERT\_FILE : 해당 peer의 TLS 서버 인증서 파일 경로
* CORE\_PEER\_TLS\_KEY\_FILE : 해당 peer의 TLS 서버 개인키가 저장된 경로
* CORE\_PEER\_TLS\_ROOTCERT\_FILE : 해당 peer의 TLS 서버 인증서를 발급한 CA의 인증서 파일 경로

### Ledger State 환경변수

* CORE\_LEDGER\_STATE\_STATEDATABASE : World State를 저장할 데이터베이스 지정 \(goleveldb/CouchDB\)
* CORE\_LEDGER\_STATE\_COUCHDBCONFIG\_COUCHDBADDRESS : 피어가 사용할 CouchDB 주소
* CORE\_LEDGER\_STATE\_COUCHDBCONFIG\_USERNAME : CouchDB에 연결할 계정명
* CORE\_LEDGER\_STATE\_COUCHDBCONFIG\_PASSWORD : CouchDB에 연결할 계정 비밀번호

## hyperledger/fabric-couchdb

### 기본 환경변수

* COUCHDB\_USER : CouchDB의 admin 계정명
* COUCHDB\_PASSWORD : CouchDB의 admin 계정 비밀번호

## hyperledger/fabric-ca

### CA Server 환경변수

* FABRIC\_CA\_HOME : fabric-ca 서버의 홈 디렉토리
* FABRIC\_CA\_SERVER\_CA\_NAME : fabric-ca 서버의 ca 이름
* FABRIC\_CA\_SERVER\_TLS\_ENABLED : fabric-ca 서버의 TLS 사용 여부
* FABRIC\_CA\_SERVER\_TLS\_CERTFILE : fabric-ca 서버의 TLS 인증서 파일 경로
* FABRIC\_CA\_SERVER\_TLS\_KEYFILE : fabric-ca 서버의 TLS 개인키가 저장된 경로

※ Fabric-CA 서버는 항상 TLS가 활성화된 상태\(TLS\_ENABLED를 true로 설정\)로 시작해야함. 그렇지 않으면 네트워크 트래픽에 대한 액세스 권한을 가진 공격자가 서버를 취약하게 만들 수 있음.

### CA Client 환경변수

* FABRIC\_CA\_CLIENT\_HOME : fabric-ca 클라이언트의 홈 디렉토리
* FABRIC\_CA\_CLIENT\_CA\_NAME : fabric-ca 클라이언트의 ca 이름
* FABRIC\_CA\_CLIENT\_TLS\_ENABLEDE : fabric-ca 클라이언트의 TLS 사용 여부
* FABRIC\_CA\_CLIENT\_TLS\_CERTFILEE : fabric-ca 클라이언트의 TLS 인증서 파일 경로
* FABRIC\_CA\_CLIENT\_TLS\_KEYFILEE : fabric-ca 클라이언트의 TLS 개인키가 저장된 경로

## hyperledger/fabric-zookeeper

### 기본 환경변수

* ZOO\_MY\_ID : zookeeper의 고유한 ID 값 \(1~255 사이의 값 적용\)
* ZOO\_SERVERS : zookeeper 전체 서버 목록 지정. 공백으로 구분 ex\) server.&lt;zookeeper ID&gt;=&lt;zookeeper서버의 hostname&gt;:&lt;zookeeper간의 통신을 위한 포트&gt;:&lt;zookeeper의 leader를 선출하기 위한 포트&gt;

## hyperledger/fabric-kafka

### 기본 환경변수

* KAFKA\_LOG\_RETENTION\_MS : 로그 파일을 삭제하기 전에 보관할 시간 \(단위: 초\)
* KAFKA\_MESSAGE\_MAX\_BYTES : 메시지의 최대 크기
* KAFKA\_REPLICA\_FETCH\_MAX\_BYTES : 복사\(replica\)될 메시지의 최대 크기
* KAFKA\_BROKER\_ID : kafka 서버의 브로커 ID
* KAFKA\_ZOOKEEPER\_CONNECT : ZooKeeper 연결 문자열을 지정. ,로 구분 ex\) &lt;zookeeper서버의 hostname&gt;:&lt;zookeeper서버의 포트번호&gt;
* KAFKA\_UNCLEAN\_LEADER\_ELECTION\_ENABLE : 부정한 리더 선정 여부. ISR\(in-sync replicas\) 집합에 포함되지 않은 복제본\(out-of-sync replicas\)을 리더로 선출할 것인지 여부. true로 설정할 경우 데이터 손실이 발생할 수 있음 \(새로 선출된 리더에 동기화 되지 않은 메세지들은 소실된다. 이 기능은 가용성과 신뢰성간 균형을 제공한다. 이 옵션이 꺼질때\(false\), 만약 브로커가 향후 사용하지 않게 될 파티션에 대한 리더 복제를 포함 하고 있고, 동기화 되지 않았지만 리더와 대체할 복제가 존재하면, 리더 복제나 다른 동기화된 복제가 온라인이 될 때까지 그 파티션은 사용할 수 없게 된다.\)
* KAFKA\_DEFAULT\_REPLICATION\_FACTOR : 자동으로 생성되는 topic의 기본 복제 수\(replication factors\)
* KAFKA\_MIN\_INSYNC\_REPLICAS : 프로듀서가 acks를 "all"\(또는 "-1"\)로 설정하여 메시지를 보낼 때, write를 성공하기 위한 최소 복제본\(replicas\)의 수
* KAFKA\_ZOOKEEPER\_CONNECTION\_TIMEOUT\_MS : 클라이언트가 zookeeper와의 연결을 대기하는 최대 시간 \(설정되지 않은 경우 zookeeper.session.timeout.ms의 값이 사용\)
* KAFKA\_ADVERTISED\_LISTENERS : 클라이언트가 사용할 수 있도록 ZooKeeper에 advertise할 listener \(&lt;호스트 주소 또는 이름&gt;:&lt;포트번호&gt; 형식 사용\)
* KAFKA\_ADVERTISED\_HOST\_NAME : 클라이언트가 사용할 수 있도록 ZooKeeper에 advertise할 호스트 이름 \(advertised.listeners 또는 listener가 설정되어 있지 않은 경우에만 사용\)
* KAFKA\_ADVERTISED\_PORT : 클라이언트가 사용할 수 있도록 ZooKeeper에 advertise할 포트 번호 \(advertised.listeners 또는 listener가 설정되어 있지 않은 경우에만 사용\)

※ KAFKA\_ADVERTISED\_HOST\_NAME과 KAFKA\_ADVERTISED\_PORT 환경 변수보다 KAFKA\_ADVERTISED\_LISTENERS 사용을 권장

※ KAFKA\_MIN\_INSYNC\_REPLICAS 최소값을 충족시킬 수 없으면 프로듀서는 예외\(NotEnoughReplicas 또는 NotEnoughReplicasAfterAppend\)를 발생  


**Reference**

* \*\*\*\*[https://github.com/naver/ngrinder/releases](https://miiingo.tistory.com/201)

