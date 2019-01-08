---
description: 삽질기
---

# Fabric Troubleshooting

## \[orderer/common/broadcast\] Handle -&gt; WARN 2e4a Error reading from 172.29.0.18:46256: rpc error: code = Canceled desc = context canceled

CLI를 통해 Invoke명령어를 실행하면 발생하는 메시지로, Orderer에 명령어를 전송하고 CLI의 접속이 끊어질때 발생하는것으로 파악된다

```bash
docker network ls
docker network inspect "네트워크명" 
```



