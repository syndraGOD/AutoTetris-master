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
    [0, 0],
    [1, 0],
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

var autoDropTime = 1000;
var autoPlayTime = 1000;

var userGameBoxID = "#gamebox";
var comGameBoxID = "#gameboxPC";

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

  InitMap(userGameBoxID);
  createBlockOrderData();

  const currentBlocks = [];

  currentBlock = new Block(userGameBoxID);
});

// [제공코드 2]
$(userGameBoxID).on("keydown", function (event) {
  if (gameMode && !autoPlayMode) {
    currentBlock.move(`${event.which}`);
  }
});

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
  const offset = $(gameBoxID + " tr")
    .eq(5)
    .offset();
  console.log(offset);
  $("#deadLine").css({ top: offset.top - 3 });
}

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

const test = (y, x) => {
  $(userGameBoxID + " tr")
    .eq(y)
    .find("td")
    .eq(x)
    .css("backgroundColor", "black");
};

$("#gameMode").on("click", () => {
  gameMode = !gameMode;
  currentBlock.timer();
});
$("#timerInterval").on("input change", () => {
  autoDropTime = $("#timerInterval").val();
  $("#currentTimeInterval").text(`${autoDropTime / 1000}s`);
});
$("#mapSize").on("input change", () => {
  size = 100 - $("#mapSize").val();
  $("#currentmapSize").text(`${$("#mapSize").val()}`);
});
