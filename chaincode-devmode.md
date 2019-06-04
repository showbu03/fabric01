# Chaincode DevMode



dev ==&gt; chaincode 컨테이너를 로컬\(Eclipse\)에서 생성

* 로컬환경 세팅\(run configuration\) . Main 탭 &gt;&gt; path of launch executeable c:\\workspace\.chaincode\biz.\bin\sample\_cc.exe . Environment 탭 CORE\_CHAINCODE\_ID\_NAME=sample\_cc:0 CORE\_CHAINCODE\_LOGGING\_LEVEL=debug CORE\_PEER\_ADDRESS=192.168.56.1:7052
* 적용순서 
* 1\) .hfn.env의 1org1peer\_dev\_mode 폴더 update 
* 2\) network 환경 기동 $ cd /usr/local//.hfn.env/1org1peer\_dev\_mode $ ./restart-d
*  $ cd /usr/local/ucare/ucare.hfn.env/1org1peer\_dev\_mode/
*  $ ./channelMgr.sh 
* $ ./ccMgr.sh
*  3\) eclipse의 체인코드 run \( 7052 port forwarding확인 \)
  * System.setProperty\("..blockchain.framework.configuration", "C:\\workspace\.cmd.sdk\framework-config-devmode.properties"\); 
* 기타

  . TLS disable 필수

  . channel은 무관

  . 체인코드 선행 컴파일 오류 식별 용이하고 신속한 수정 및 테스트 가능

  . 실제환경과 상이함으로 발생되는 오류 발생 가능섬 내포

