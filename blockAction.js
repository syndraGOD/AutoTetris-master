// 블럭이 동시에 여러개 떨어지면 재밌을것 같아 약간만 수정하면 해당 기능을 구현 가능하게 개발했습니다.
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
    this.timer();
    pointAdd(this.blocks.length);
  }
  arrive() {
    var ys = this.blocks.map(([y, x]) => y + this.position[0]);
    ys = [...new Set(ys)];
    if (!ys.every((x) => x > 4)) {
      gameover();
    } else {
      ys.map((x) => eraseBlock(x));
      currentBlock = new Block(userGameBoxID);
    }
  }
  timer() {
    const callbackTimer = (current) => {
      if (!gameMode) return;
      if (current.move("40")) {
        setTimeout(callbackTimer, autoDropTime, current);
      } else {
        this.arrive();
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
    nextBlockDraw();
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
      if (!this.isCanMove(1)) return false;
      // return false;
      this.position[1] -= 1;
      //right
    } else if (keyCode === "39") {
      const maxZ =
        Math.max(...this.blocks.map(([y, x]) => x)) +
        1 /*x좌표는 0부터시작, col은 1부터시작*/ +
        this.position[1];
      if (maxZ >= Col) return false;
      if (!this.isCanMove(2)) return false;
      this.position[1] += 1;
      //down
    } else if (keyCode === "40") {
      if (!this.isCanMove(0)) return false;
      this.position[0] += 1;
      //up , rotate
    } else if (keyCode === "38") {
      // this.blocks
      var result = this.blocks.map(([y, x]) => {
        switch (this.blockSetNumber) {
          case 0:
            return [y, x];
          case 1:
          case 2:
          case 6:
            return [x, -y + 2];
          // return [x, -y];
          case 3:
          case 4:
            return [x, y];
          case 5:
            return [x + 1, y - 1];
          // return [x, y];
        }
        // return [x + 1, -y + 1];
      });
      //일괄검증 위해 추가한 코드
      var testTemp1 = this.blocks.map(([y, x]) => [
        y + this.position[0],
        x + this.position[1],
      ]);
      var testTemp2 = result.map(([y, x]) => [
        y + this.position[0],
        x + this.position[1],
      ]);
      if (bgColorTransaction(testTemp1, testTemp2)) {
        this.blocks = result;
      } else {
        console.log("다른 블럭과 충돌합니다");
        console.log(bgColorTransaction(testTemp1, testTemp2));
      }
      // this.blocks = result;
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
  isCanMove(direction) {
    // 0 = down, 1 = left, 2 = right
    if (direction === 0) {
      const xOfLowY = {};
      // x값에 대한 가장 낮은 위치에 있는 블럭들을 찾음
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
        return result;
      });
      return b;
      // console.log("xoflowy : ", xOfLowY);
      // console.log("finish_result", b);
    } else if (direction === 1) {
      const xOfLowY = {};
      // y값에 대한 가장 왼쪽 위치에 있는 블럭들을 찾음
      this.blocks.map(([y, x]) => {
        xOfLowY[y] === undefined || xOfLowY[y] > x ? (xOfLowY[y] = x) : null;
      });
      // console.log("히히 작동");
      // console.log(xOfLowY);

      return Object.entries(xOfLowY).every(([y, x]) => {
        return (
          $(this.gameBoxID)
            .find("tr")
            .eq(Number(y) + this.position[0])
            .find("td")
            .eq(Number(x) + this.position[1] - 1)
            .css("backgroundColor") === "rgba(0, 0, 0, 0)"
        ); // 밑에 블럭이 안비어있으면 false반환
      });
    } else if (direction === 2) {
      const xOfLowY = {};
      // y값에 대한 가장 오른쪽 위치에 있는 블럭들을 찾음
      this.blocks.map(([y, x]) => {
        xOfLowY[y] === undefined || xOfLowY[y] < x ? (xOfLowY[y] = x) : null;
      });

      return Object.entries(xOfLowY).every(([y, x]) => {
        return (
          $(this.gameBoxID)
            .find("tr")
            .eq(Number(y) + this.position[0])
            .find("td")
            .eq(Number(x) + this.position[1] + 1)
            .css("backgroundColor") === "rgba(0, 0, 0, 0)"
        ); // 밑에 블럭이 안비어있으면 false반환
      });
    }
  }
  //  isFull(){

  //  }
}

//bgcolor가 변경될곳에 이미 블럭이 있는지 색상비교로 체크
//경기장 밖으로 나가려하는지 마찬가지로 검사
const bgColorTransaction = (beforeArr, AfterArr) => {
  beforeArr = beforeArr.map((x) => JSON.stringify(x));
  AfterArr = AfterArr.map((x) => JSON.stringify(x));
  let difference = AfterArr.filter((x) => !beforeArr.includes(x));
  difference = difference.map((x) => JSON.parse(x));

  console.log(beforeArr, AfterArr, difference);
  return difference.every(([y, x]) => {
    if (
      $(userGameBoxID)
        .find("tr")
        .eq(y)
        .find("td")
        .eq(x)
        .css("backgroundColor") === "rgba(0, 0, 0, 0)" &&
      y >= 0 &&
      y < Row &&
      x >= 0 &&
      x < Col
    ) {
      // console.log(y >= 0 && y < Row && x >= 0 && x < Col);
      return true;
    } else {
      return false;
    }
  });
};

const eraseBlock = (line) => {
  for (var i = 0; i < Col; i++) {
    if (
      $(userGameBoxID + " tr")
        .eq(line)
        .find("td")
        .eq(i)
        .css("backgroundColor") === "rgba(0, 0, 0, 0)"
    )
      return;
  }
  for (var i = 0; i < Col; i++) {
    $(userGameBoxID + " tr")
      .eq(line)
      .find("td")
      .eq(i)
      .css("backgroundColor", "rgba(0, 0, 0, 0)");
  }
  $(userGameBoxID + " tr")
    .eq(line)
    .remove()
    .prependTo(userGameBoxID);
  pointAdd(70);
};

const nextBlockDraw = () => {
  $("#nextBlock1 td").css("backgroundColor", "rgba(0, 0, 0, 0)");
  var blocks = blockSet[nextBlockType[0]];
  if (nextBlockType[0] === 5) blocks = blocks.map(([y, x]) => [y, x + 1]); // 1이 왼쪽으로 한칸 가있어서 오른쪽으로 한칸만이동
  const color = blockColor[nextBlockType[0]];
  blocks.map(([y, x]) => {
    $("#nextBlock1")
      .find("tr")
      .eq(y + 1)
      .find("td")
      .eq(x + 1)
      .css("backgroundColor", color);
  });
};
// var blockCount = 0;

const pointAdd = (amount) => {
  var point = Number($("#score").text());
  $("#score").text(point + amount * 10);
};

const gameover = () => {
  gameMode = false;
  // $("label#score").text(0);
  $("#startBtn").css("visibility", "visible");
  $("#winImg").css("display", "block");
  $(userGameBoxID).css("opacity", "1.0");
};

$("#gameMode").on("click", () => {
  gameMode = !gameMode;
  currentBlock.timer();
});

const test = (y, x) => {
  $(userGameBoxID + " tr")
    .eq(y)
    .find("td")
    .eq(x)
    .css("backgroundColor", "black");
};
