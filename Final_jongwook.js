
// Webcam Piano TEMPLATE

var prevImg;
var currImg;
var diffImg;


var grid;

var capture;


function setup() {  //==> createCanvas 랑 grid 를 똑같이 맞춰줘야한다.
    
    //createCanvas(windowWidth/3, windowHeight/2); // 걍 전체 캔버스 사이즈
    createCanvas(640, 480); // 걍 전체 캔버스 사이즈
    // createCanvas(390, 240);
    pixelDensity(1);
    capture = createCapture(VIDEO);   // => capture = 메인 이미지 영상
    //capture.hide();
    //capture.size(windowWidth/3, windowHeight/2);  // 이게 진짜 카메라임. 블러된거 말고
    
    // 적절한 값으로 맞춰줘야함.
    grid = new Grid(640, 480);   // 손 움직일때 동선이 나오는 그리드 크기임.
    
    // 미리 계이름 불러놓기
    C= loadSound('sound1.mp3');
    D= loadSound('sound2.mp3');
    E= loadSound('sound3.mp3');
    F= loadSound('sound4.mp3');
    G= loadSound('sound5.mp3');
    A= loadSound('sound6.mp3');
    B= loadSound('sound7.mp3');
    C2= loadSound('sound8.mp3');
}

function draw() {
    background(255);  //배경색 255 = 검정
    image(capture, 0, 0); // (이미지의 왼쪽 젤 위 좌표임.)
    //filter('INVERT')
    capture.loadPixels();  // 픽셀 정보를 불러온다.


    // 피아노 모양 만들기
    // 도
    fill(0,204,255);
    rect(0,0,70,200);
    // 레
    fill(30,144,255);
    rect(80,0,70,200);
    // 미
    fill(0,0,255);
    rect(160,0,70,200);
    // 파
    fill(0,0,128);
    rect(240,0,70,200);
    // 솔
    fill(75,0,130);
    rect(320,0,70,200);
    // 라
    fill(153,50,204);
    rect(400,0,70,200);
    // 시
    fill(139,0,139);
    rect(480,0,70,200);
    // 도
    fill(238,130,238);
    rect(560,0,70,200);
    var w = capture.width/4;  // 위에서 불러온 loadpixel 데이터를 이용하는거지 ==> 메인화면 말고 블러랑, 디프런셜 계산하는 화면 크기임.
    var h = capture.height/4;

    currImg = createImage(w, h);   // ==> currImg = 블러된 두번째 영상
    currImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, w, h); // save current frame
    //     .copy(이미지, 이미지시작x좌표, 이미지 시작 y좌표, 소스 이미지 w, 소스 이미지h, 뒤는 똑같이. )

    diffImg = createImage(w, h);   // diffImg = 검정색 디프런셜 영상
    // currImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, w, h); // save current frame


    // 
    //currImg.filter(GRAY);   // filter 때문에 왜곡된 화면이 나오는거지.
    //currImg.filter(BLUR, 3);  // 값이 클수록 블러 정도 심해짐. 


    // 일단 첫번째 if문을 만나면 
    if (typeof prevImg !== 'undefined') {   // typeof 변수 타입 알아보는거 
        currImg.loadPixels();
        diffImg.loadPixels();
        prevImg.loadPixels();


        // 여기서 currImg 의 인덱스를 끝까지 안가게 해서 유효 영역을 조절할 수 있지 않을까,,
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {

                var index = (x + (y*currImg.width))*4; //w?   
                // index 를 [0, 4, 8, 12, 16, 20
                //          24,28,32,36, 40, 44   이런식으로 만들었네?

                // 이미 위에서 xxxx.loadPixels() 로 픽셀정보는 불러놨으니깐,,,
                var r = currImg.pixels[index];
                var r2 = prevImg.pixels[index];
                var distance = abs(r - r2);   // difference 계산하는거

                diffImg.pixels[index] = diffImg.pixels[index+1] = diffImg.pixels[index+2] = distance;
                diffImg.pixels[index+3] = 255;


            }
        }


        diffImg.updatePixels();

    }
    

    // diff image 에는 threshold 취함.  필터 없어도 뭐가 보이긴 보임.
    diffImg.filter(THRESHOLD, 0.1);  //0.073  ==> 숫자가 작을수록 많이 움직임.

    diffImg.loadPixels();
    if (diffImg.pixels[40||41||42||43]>0.1){
      C.play();
    }
    if (diffImg.pixels[118||119||120||121]>0.11){
      D.play();
    }
    if (diffImg.pixels[198||199||200||201]>0.11){
      E.play();
    }
    if (diffImg.pixels[278||279||280||281]>0.11){
      F.play();
    }
    if (diffImg.pixels[358||359||360||361]>0.11){
      G.play();
    }
    if (diffImg.pixels[438||439||440||441||442||443||444]>0.1){
      A.play();
    }
    if (diffImg.pixels[518]>0.2){
      B.play();
    }
    if (diffImg.pixels[620]>0.2){
      C2.play();
    }

      //else{
                //  Do.stop();
                //}

    prevImg = createImage(w, h);
    prevImg.copy(currImg, 0, 0, w, h, 0, 0, w, h);

    //image(currImg, 640, 0);  // 두번째 영상 시작하는 좌표 : 640,0 이어야 딱 이어서 시작함.
    image(diffImg, 240,300);

    grid.update(diffImg);
}


// 쓸모없음.
//function mousePressed() {
//    threshold = map(mouseX, 0, 640, 0, 1);   // map => (0 ~ 640) 범위를 (0~1) 로 바꿔주세요.
//    blur = map(mouseY, 0, 480, 0, 10);
//    // console.log(threshold);
//    // console.log(blur);
//}
///////////////////////////////////////////////////////


var Grid = function(_w, _h){
  this.diffImg = 0;
  this.noteWidth = 40;
  this.worldWidth = _w;
  this.worldHeight = _h;
  this.numOfNotesX = int(this.worldWidth/this.noteWidth);
  this.numOfNotesY = int(this.worldHeight/this.noteWidth);
  //this.arrayLength = this.numOfNotesX * this.numOfNotesY;
  this.arrayLength = this.numOfNotesX * this.numOfNotesY;
  this.noteStates = [];
  this.noteStates =  new Array(this.arrayLength).fill(0);

  this.floatPos =  new Array(this.arrayLength).fill(0); //to make circles float

  this.colorArray = [];

  //This is to use with lerpColor
  from = color(255, 0, 0,200);   // 빨강에서 파랑으로 바뀌게 설정함.
  to = color(0, 0, 255,200);
  colorMode(RGB);


  // set the original colors of the notes
  for (var i=0;i<this.arrayLength;i++){
    // this.colorArray.push(color(255,0,0,150));
    this.colorArray.push(lerpColor(from, to, i/this.arrayLength));  //colorArray 에다가 lerpColor 를 밀어넣지..
  }


this.update = function(_img){
  this.diffImg = _img;
  this.diffImg.loadPixels();
  for (var x = 0; x < this.diffImg.width; x += 1) {
      for (var y = 0; y < this.diffImg.height; y += 1) {
          var index = (x + (y * this.diffImg.width)) * 4;
          var state = diffImg.pixels[index + 0];
          if (state==255){
            var screenX = map(x, 0, this.diffImg.width, 0, this.worldWidth);
            var screenY = map(y, 0, this.diffImg.height, 0, this.worldHeight);
            var noteIndexX = int(screenX/this.noteWidth);
            var noteIndexY = int(screenY/this.noteWidth);
            var noteIndex = noteIndexX + noteIndexY*this.numOfNotesX;
            this.noteStates[noteIndex] = 1;
          }
      }
  }

  //this is what "ages" the notes so that as time goes by things can change.
  for (var i=0; i<this.arrayLength;i++){
    this.noteStates[i]-= 0.1;  //숫자가 클수록 모양들이 빠르게 없어진다.
    this.noteStates[i]=constrain(this.noteStates[i],0,1);
  }

  this.draw();
};


// this is where each note is drawn
// use can use the noteStates variable to affect the notes as time goes by
// after that region has been activated
this.draw = function(){
  push();
  noStroke();
  for (var x=0; x<this.numOfNotesX; x++){
    for (var y=0; y<this.numOfNotesY; y++){
            var posX = this.noteWidth/2 + x*this.noteWidth;
            var posY = this.noteWidth/2 + y*this.noteWidth;
            var noteIndex = x + (y * this.numOfNotesX);
            if (this.noteStates[noteIndex]>0) {
              fill(this.colorArray[noteIndex]);
              
              ellipse(posX,posY,floor(random(this.noteWidth/2)),floor(random(this.noteWidth/2)));
              fill(color(100,255,0,100));

              ellipse(posX - this.floatPos[noteIndex],posY + this.floatPos[noteIndex],this.noteWidth,this.noteWidth);
              this.floatPos[noteIndex]--;
            }else{
                this.floatPos[noteIndex] = 0;
            }
        }
  }
  pop();
}
};


