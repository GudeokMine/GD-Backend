module.exports = {
    apps : [{
        name : "gdmine",
      script    : "./bin/www", 
    //   instances : "2", // 실행시킬 프로세스의 갯수(max로 입력할 경우 최대 갯수로 설정한다.)
    //   exec_mode : "cluster", // cluster 모드로 어플리케이션을 구동시킨다.
    //   merge_logs: true,
      watch: true, // 파일 변경시 재시작
    }]
  }