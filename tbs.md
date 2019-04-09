---
description: 삽질기
---

# Fabric Troubleshooting

## \[orderer/common/broadcast\] Handle -&gt; WARN 2e4a Error reading from 172.29.0.18:46256: rpc error: code = Canceled desc = context canceled

CLI를 통해 Invoke명령어를 실행하면 발생하는 메시지로, Orderer에 명령어를 전송하고 CLI의 접속이 끊어질때 발생하는것으로 파악된다

```bash
docker network ls
docker network inspect e2e_default
```

![](.gitbook/assets/image%20%285%29.png)

위 명령어로 해당 IP의 컨테이너를 확인해 보면 172.29.0.18은 CLI 컨테이너 인것을 확인할 수 있다.

## **Error: failed to create deliver client: orderer client failed to connect to** orderer0:7050: failed to create new connection: context deadline exceeded

위 오류는 orderer0:7050과 연결하지 못했을때 발생하는 오류로 IP/PORT 네트워크 상태를 확인해야 된다.

```text
netstat -nptl
```

![](.gitbook/assets/image%20%287%29.png)

위의 네트워크 상태 결과와 같이 7050으로 정상적으로 리스닝이 되고 있는지 확인해야 된다.



