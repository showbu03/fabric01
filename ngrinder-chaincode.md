# nGrinder기반의 Chaincode 성능 테스트 환경 구성

## nGrinder Controller 구동

github : [https://naver.github.io/ngrinder/](https://naver.github.io/ngrinder/)

사전 준비사항 : Ubuntu 18.04 설치, openJdk 8 설치, ngrinder-controller-3.4.2.war 다운로드

1. nGrinder Controller 구동 스크립트 작성

start.sh

    #!/bin/sh

    echo ##################################################
    echo Ngrinder Controller Start.........
    echo ##################################################

    JAVA_HOME=/usr/local/java
    LIB_DIR=/usr/local/ngrinder/libs
    CLASSPATH="."
    #LOG_DATE=`date +%Y%m%d_%H%M%S`

    jars=$(find $LIB_DIR -type f -name "*.jar")
    for jar in $jars; do
       CLASSPATH="$CLASSPATH:$jar"
    done

    mv ngrinder.log ./log/ngrinder_${LOG_DATE}.log

    nohup $JAVA_HOME/bin/java -cp $CLASSPATH -XX:MaxPermSize=200m -jar ngrinder-controller-3.4.2.war -p 7070 > ngrinder.log 2>&1 &

2. nGrinder Controller 구동

```
$ ./start.sh

.......
2019-04-08 11:47:12.598:INFO:oejs.ServerConnector:main: Started ServerConnector@70db90b6{HTTP/1.1}{0.0.0.0:7070}
2019-04-08 11:47:12.602:INFO:oejs.Server:main: Started @31974ms
```

3. 접속 확인

http://192.168.56.2:7070     \( ID : admin  / PW : admin\)

![](.gitbook/assets/image%20%281%29.png)

## nGrinder Agent 구동

ngrinder 로그인 후 우측 상단의 admin 메뉴의 "Agent Management" 클릭

![](.gitbook/assets/image%20%284%29.png)

Agent Management 메뉴에서 "ngrinder-agent-3.4.2.tar" Download

![](.gitbook/assets/image%20%286%29.png)

사전 준비사항 : Ubuntu 18.04 설치, openJdk 8 설치, ngrinder-agent-3.4.2.war 다운로드

1. nGrinder Agent 환경설정 스크립트 작

%ngrinder\_agent\_home%/\_\_agent.conf

```text
common.start_mode-=agent
agent.controller_host=192.168.56.2
agent.controller_port=16001
agent.resion=NONE
```

