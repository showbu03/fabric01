---
description: Hyperledger Fabric의 Kafka Cluster Sample
---

# Kafka Cluster Sample

## [Fabric Download & Build](https://github.com/hyperledger/fabric) 

```text
git clone https://github.com/hyperledger/fabric
cd fabric
make
```

{% hint style="info" %}
Fabric 환경변수 설정은 Hyperledger Fabric 환경구성 페이지 참고
{% endhint %}

## [e2e\_cli network up ](https://github.com/hyperledger/fabric) 

```text
cd example/e2e_cli
./network_setup.sh up mychannel 50000 couchdb
```

![](.gitbook/assets/image%20%283%29.png)

## [e2e\_cli network down](https://github.com/hyperledger/fabric)

```text
./network_setup.sh down
```

![](.gitbook/assets/image%20%284%29.png)

