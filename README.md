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
      
