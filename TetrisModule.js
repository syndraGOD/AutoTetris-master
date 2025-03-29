// [유의사항]
// 제공 파일은 PC랑 1:1 대전모드 기반으로 만들어졌기에 솔플 모드로 먼저 개발을 추천.
// 대전모드를 고려하여 설계해도 좋음 ex) gameBoxId 변수

// [요구사항]
// - 테트리스 블럭 총 7가지를 테트리스 규칙에 따라 제작.

// - 초기 블럭 위치 배열 제공
// var blockSet = [
//   [
//     [0, 4],
//     [0, 5],
//     [1, 4],
//     [1, 5],
//   ], // 네모
//   [
//     [1, 4],
//     [0, 3],
//     [1, 3],
//     [1, 5],
//   ], // 니은
//   [
//     [1, 4],
//     [1, 3],
//     [1, 5],
//     [0, 5],
//   ], // 반대 니은
//   [
//     [1, 4],
//     [0, 4],
//     [1, 5],
//     [2, 5],
//   ], // 꼬부리
//   [
//     [1, 5],
//     [1, 4],
//     [0, 5],
//     [2, 4],
//   ], // 반대꼬부리
//   [
//     [1, 4],
//     [0, 4],
//     [2, 4],
//     [3, 4],
//   ], // ㅣ
//   [
//     [1, 4],
//     [1, 3],
//     [1, 5],
//     [0, 4],
//   ],
// ]; // ㅗ
var blockSet = [
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ], // 네모
  [
    [1, 1],
    [0, 0],
    [1, 0],
    [1, 2],
  ], // 니은
  [
    [1, 1],
    [1, 0],
    [1, 2],
    [0, 2],
  ], // 반대 니은
  [
    [1, 0],
    [0, 0],
    [1, 1],
    [2, 1],
  ], // 꼬부리
  [
    [1, 1],
    [1, 0],
    [0, 1],
    [2, 0],
  ], // 반대꼬부리
  [
    [1, 0],
    [0, 0],
    [2, 0],
    [3, 0],
  ], // ㅣ
  [
    [1, 1],
    [1, 0],
    [1, 2],
    [0, 1],
  ],
]; // ㅗ
var blockColor = {
  0: "#02feff",
  1: "#0032fe",
  2: "#ffaa00",
  3: "#0afb21",
  4: "#fffb09",
  5: "#ff1000",
  6: "#9833fe",
};
// - 전역 변수
var size = 40;
var Row, Col;
var currentBlock;
var currentBlockType,
  nextBlockType = [],
  currentBlockTypePC,
  nextBlockTypePC = [];
var gameMode = false;
var guideMode = true;
var rotateMode = true;
var rotateType = true;

var blockOrderData = [];
var blockOrderDataPC = [];

var timer, autoTimer, comTimer, comAutoTimer;
var autoPlayMode = false;

var autoDropTime = 500;
var autoPlayTime = 1000;

var userGameBoxID = "#gamebox";
var comGameBoxID = "#gameboxPC";

var a;
// var blockCount = 0;
class Block {
  constructor(gameBoxID) {
    // const blockSetNumber = nextBlockType.shift();

    this.blockSetNumber;

    if (gameBoxID === userGameBoxID) {
      this.blockSetNumber = nextBlockType.shift();
      nextBlockType.push(blockOrderData.shift());
    } else if (gameBoxID === comGameBoxID) {
    }
    this.gameBoxID = gameBoxID;
    this.position = [1, Col / 2 - 1 - Math.round(Math.random())]; // y, x
    this.oldAbsolutePosition = [];
    this.blocks = blockSet[this.blockSetNumber];
    this.color = blockColor[this.blockSetNumber];
    this.init();
    // this.htmlId = `#currentBlock${blockCount}`;
  }

  init() {
    this.create();
    const callbackTimer = (current) => {
      if (current.move("40")) {
        setTimeout(callbackTimer, autoDropTime, current);
      } else {
        currentBlock = new Block(userGameBoxID);
        // currentBlocks.push(currentBlock);
      }
    };
    timer = setTimeout(callbackTimer, autoDropTime, this);
  }
  create() {
    this.blocks.map(([y, x]) => {
      $(this.gameBoxID)
        .find("tr")
        .eq(this.position[0] + y)
        .find("td")
        .eq(this.position[1] + x)
        .css("backgroundColor", this.color);
      this.oldAbsolutePosition.push([
        this.position[0] + y,
        this.position[1] + x,
      ]);
    });
    // this.oldPosition = [...this.position];
    // $(gameBoxID).find("tr").eq(i).find("td").eq(j);
  }
  delete() {
    // this.blocks.map(([y, x]) => {
    //   $(this.gameBoxID)
    //     .find("tr")
    //     .eq(this.oldAbsolutePosition[0] + y)
    //     .find("td")
    //     .eq(this.oldAbsolutePosition[1] + x)
    //     .css("backgroundColor", "#FFFFFF");
    // });
    this.oldAbsolutePosition.map(([y, x]) => {
      $(this.gameBoxID)
        .find("tr")
        .eq(y)
        .find("td")
        .eq(x)
        .css("backgroundColor", "rgba(0, 0, 0, 0)");
    });
  }
  move(keyCode) {
    //left
    if (keyCode === "37") {
      if (this.position[1] <= 0) return false;
      this.position[1] -= 1;
      //right
    } else if (keyCode === "39") {
      const maxZ =
        Math.max(...this.blocks.map(([y, x]) => x)) +
        1 /*x좌표는 0부터시작, col은 1부터시작*/ +
        this.position[1];
      console.log(maxZ, Col);
      if (maxZ >= Col) return false;
      this.position[1] += 1;
      //down
    } else if (keyCode === "40") {
      if (!this.isGrounded()) return false;
      this.position[0] += 1;
      //up , rotate
    } else if (keyCode === "38") {
      this.blocks = this.blocks.map(([y, x]) => {
        switch (this.blockSetNumber) {
          case 0:
            return [y, x];
          case 1:
          case 2:
          case 6:
            return [x, -y + 2];
          case 3:
          case 4:
            return [x, y];
          case 5:
            return [x + 1, y - 1];
        }
        // return [x + 1, -y + 1];
      });
    } else if (keyCode === "90") {
      this.drop();
      // this.position = this.position.map(([y, x]) => [y, x]);
    }

    this.delete();
    this.create();
    // this.isMoveEnd();
    // return ;
    return true;
  }
  drop() {
    while (this.move("40")) {}
  }
  isGrounded() {
    const xOfLowY = {};
    // x값에 대한 가장 낮은 위치에 있는 y 블럭들을 찾음
    this.blocks.map(([y, x]) =>
      xOfLowY[x] === undefined || xOfLowY[x] < y ? (xOfLowY[x] = y) : null
    );
    const b = Object.entries(xOfLowY).every(([x, y]) => {
      const result =
        y + this.position[0] + 1 < Row && // 경기장 밖으로 넘어갔거나
        $(this.gameBoxID)
          .find("tr")
          .eq(y + this.position[0] + 1)
          .find("td")
          .eq(Number(x) + this.position[1])
          .css("backgroundColor") === "rgba(0, 0, 0, 0)"; // 밑에 블럭이 안비어있으면 false반환
      // console.log(y, this.position[0], Row);
      // console.log(
      //   $(this.gameBoxID)
      //     .find("tr")
      //     .eq(y + this.position[0] + 1)
      //     .find("td")
      //     .eq(Number(x) + this.position[1])
      //     .css("backgroundColor")
      // );
      return result;
    });
    return b;
    // console.log("xoflowy : ", xOfLowY);
    // console.log("finish_result", b);
  }
  //  isFull(){

  //  }
}
// - 맵 사이즈 : size에 따라 동적 생성 40으로 설정시 10 X 20 (제공코드 1 참고)
// - 타이머 시간에 따라 1칸씩 내려오며 블럭이 바닥이나 다른 블럭에 닿는 경우 새로운 블럭 생성 (setTimeout 함수)

// - 키보드 방향키로 양옆, 아래로 한칸씩 이동 가능 벽에 닿으면 이동 불가
// - Z 클릭시 바로 바닥으로 내려감 (제공코드 2 참고)
// - 줄이 모두 채워지면 그 줄은 사라져야함
// [제공코드 1]

$("#startBtn").on("click", function (event) {
  gameMode = true;
  $("label#score").text(0);
  $("#startBtn").css("visibility", "hidden");
  $(".matchResult").css("display", "none");
  $(userGameBoxID).css("opacity", "1.0");
  $(comGameBoxID).css("opacity", "1.0");
  $(userGameBoxID).focus();
  Row = Math.round($(userGameBoxID).height() / size);
  Col = Math.round($(userGameBoxID).width() / size);
  console.log("row", Row);

  InitMap(userGameBoxID);
  // InitMap(comGameBoxID);
  createBlockOrderData();

  const currentBlocks = [];
  // currentBlockType = nextBlockType.shift();

  currentBlock = new Block(userGameBoxID);
});

// [제공코드 2]
$(userGameBoxID).on("keydown", function (event) {
  console.log(gameMode, currentBlock, event.which);
  if (gameMode && !autoPlayMode) {
    currentBlock.move(`${event.which}`);
    if (event.which == "37") {
      // Left

      currentBlock.move(event.which);
    } else if (event.which == "39") {
      // Right

      currentBlock.move(event.which);
    }
  } else if (event.which == "40") {
    currentBlock.move(event.which);
    // Down
  } else if (event.which == "38") {
    currentBlock.move(event.which);
    // Up / Rotate
  } else if (event.which == "90") {
    currentBlock.move(event.which);
    // Z Key
  }
});

// [함수 설명(파라미터 제외)]
// InitMap() : 맵 생성
function InitMap(gameBoxID) {
  if ($(gameBoxID + ":has(tr)").length == 0) {
    for (var i = 0; i < Row; i++) $(gameBoxID).append("<tr></tr>");
    for (var j = 0; j < Col; j++) $(gameBoxID + " tr").append("<td></td>");
  }

  for (var i = 0; i < Row; i++) {
    for (var j = 0; j < Col; j++) {
      $(gameBoxID + " tr")
        .eq(i)
        .children()
        .eq(j)
        .css("backgroundColor", "rgba(0, 0, 0, 0)");
      $(gameBoxID + " tr")
        .eq(i)
        .children()
        .eq(j)
        .attr("class", "originBlock");
    }
  }
}

// createBlockOrderData() : 나올 블록 5천개 랜덤으로 생성해서 배열에 저장.
function createBlockOrderData() {
  for (var j = 0; j < 5000; j++) {
    var tempData = [0, 1, 2, 3, 4, 5, 6];
    for (var i = 0; i < 20; i++) {
      var val1 = Math.floor(Math.random() * 7);
      var val2 = Math.floor(Math.random() * 7);

      var temp = tempData[val1];
      tempData[val1] = tempData[val2];
      tempData[val2] = temp;
    }
    blockOrderData = blockOrderData.concat(tempData);
  }

  blockOrderDataPC = blockOrderData.slice();

  nextBlockType.push(blockOrderData.shift());
  nextBlockType.push(blockOrderData.shift());
}

// createBlock() : 신규 블록 띄우기
function createBlock(HTMLIndex) {
  // console.log(blockOrderData);
  // $(HTMLIndex).add
}
// fillBlock() : 블록 색칠하기
// isOverlayed() : 벽이나 다른 블록과 닿았는지 확인
// moveBlock() : 블록 이동
// rotateBlock() : 블럭 회전, 현재 위치에서 회전 가능한지 판단 필요

// [참고 코드 : 블럭 회전시 사용하는 수식]
var rotate90Mode = [
  [0, -1],
  [1, 0],
]; // 시계방향
var rotate270Mode = [
  [0, 1],
  [-1, 0],
]; // 반시계방향

// let tempBlock = multiplyMatrix(tempBlock, rotate90Mode);
function multiplyMatrix(a, b) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += Math.round(a[r][i] * b[i][c]);
      }
    }
  }
  return m;
}

// dropBlock() : 블럭을 맨 아래 위치로 내림
// drawGuide() : 현재 블록 모양과 위치에 따른 가이드 블록 표시
// eraseBlock() : 한줄 다 채워지면 줄 삭제

// [Tip]
// - XXX.find('tr').eq(i).find('td').eq(j) i번째 tr, j번째 td를 찾아 색칠하여 해당 블럭의 위치를 표시, 해당 칸 색상을 비교하여 블록 존재 유무 파악 가능 (기존 블럭 위치 기억할 필요 없음)
