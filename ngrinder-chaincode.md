# nGrinder 환경 구성

## 

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

![](.gitbook/assets/image%20%287%29.png)

Agent Management 메뉴에서 "ngrinder-agent-3.4.2.tar" Download

![](.gitbook/assets/image%20%289%29.png)

사전 준비사항 : Ubuntu 18.04 설치, openJdk 8 설치, ngrinder-agent-3.4.2.tar 다운로드

#### nGrinder Agent 환경설정 스크립트 작성

%ngrinder\_agent\_home%/\_\_agent.conf

```text
common.start_mode-=agent
agent.controller_host=192.168.56.2   //컨트롤러 IP
agent.controller_port=16001          //컨트롤러 연결 Port
agent.resion=NONE
```

**nGrinder Agent 압출 해제 및 설정파일 이동**  
tar -xvf ngrinder-agent-3.4.2.tar  
mv \_\_agent.conf ngrinder-agent

**nGrinder Agent 실행**  
cd ngrinder-agent  
./run\_agent.sh

![](.gitbook/assets/image%20%284%29.png)

#### nGrinder Agent 활성화

nGrinder 사이트 접속 후 "Agent Management"메뉴 접속  
Agent 리스트에 구동된 Agent 확인 후 "Approved" 버튼을 클릭하여 승인

![](.gitbook/assets/image%20%282%29.png)

#### Agent 활성화 확인

"Performance Test"메뉴에서 "Create Test" 버튼 클릭  
아래 사진과 같이 Agent 항목에 Max값이 1로 표기된걸 확인 할 수 있다.  
실제 성능 테스트에 필요한 만큼 Agent를 추가하여 사용하면 된다.

![](.gitbook/assets/image%20%283%29.png)

