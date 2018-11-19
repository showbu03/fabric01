# fabric01

## Ubuntu 환경설정
1. virtualbox에 18.04 설치
2. 공유폴더 설정
    * 이름 : share 으로 생성
    * VM VirtualBox의 상단 메뉴 "장치"-> 게스트 확장 CD 이미지 삽입 -> 실행 -> root 비번 입력 -> 설치 콘솔 -> 엔터(종료)
    * 터미널 -> sudo reboot
    * 공유폴더 mount
      * sudo mkdir -p /usr/shared
      * sudo mount -t vboxsf share /usr/shared
      
    

    
