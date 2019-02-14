// To do:
// - make cards
// - make houses, hotels
// - make bankrupt system
// - make mortgaging
// - make trading
// - make event log

var allPlayers = [];
var allProperties = [];
var allTokens = [];
var dieFaces = [1, 2, 3, 4, 5, 6];
var die1 = 0;
var die2 = 0;


let doubleDice = 0;
let rollVal = 0;
var hasRolled = 0;

var canvasWidth = 900;
var canvasHeight = 900;

var cardWidth = 75;
var cardHeight = 75;
var cardTextSize = 10;

var p1BoxX = canvasWidth - canvasWidth * 0.86;
var p1BoxY = canvasHeight - canvasHeight * 0.8;
var p1BoxWidth = 150;
var p1BoxHeight = 200;

var p2BoxX = canvasWidth - canvasWidth * 0.68;
var p2BoxY = canvasHeight - canvasHeight * 0.8;
var p2BoxWidth = 150;
var p2BoxHeight = 200;

var p3BoxX = canvasWidth - canvasWidth * 0.50;
var p3BoxY = canvasHeight - canvasHeight * 0.8;
var p3BoxWidth = 150;
var p3BoxHeight = 200;

var p4BoxX = canvasWidth - canvasWidth * 0.32;
var p4BoxY = canvasHeight - canvasHeight * 0.8;
var p4BoxWidth = 150;
var p4BoxHeight = 200;

var xshift = 0;
var yshift = 0;
var count = 0;

var smallCardSize = 15;

var rollButtonText = "ROLL"
var rollButtonW = 100;
var rollButtonH = 100;
const rollButtonX = (canvasWidth / 2) - rollButtonW / 2;
const rollButtonY = (canvasHeight / 2) - rollButtonH / 2;

var buyButtonText = "BUY"
var buyButtonW = 100;
var buyButtonH = 100;
var buyButtonX = (canvasWidth / 2) - buyButtonW / 2;
var buyButtonY = (canvasHeight / 2) - (buyButtonH / 2) + 250;

const endButtonW = 100;
const endButtonH = 100;
const endButtonX = (canvasWidth / 2) - buyButtonW / 2 + 250;
const endButtonY = (canvasHeight / 2) - (buyButtonH / 2);

var message = 0;
var turnNumber = 0;

//CLASSES
class Token {
  constructor(x,y,currentPosition,tokenColor){
    this.x = x;
    this.y = y;
    this.currentPosition = currentPosition;
    this.tokenColor = tokenColor;
  }
}

class Player {
  constructor(name, cash, playerPosition, propertiesOwned,inJail) {
    this.name = name;
    this.cash = cash;
    this.position = playerPosition;
    this.propertiesOwned = propertiesOwned;
    this.injail = inJail;
  }
}

class Property {
  constructor(x, y, w, h, price, name, groupColor, boardPosition, buyable, owner, rent) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.price = price;
    this.name = name;
    this.color = groupColor;
    this.boardPosition = boardPosition;
    this.buyable = buyable;
		this.owner = owner;
    this.rent = rent;
  }

  drawCard() {
    fill(255, 255, 255);
    strokeWeight(4);
    rect(this.x, this.y, this.w, this.h);
    fill(this.color);
    strokeWeight(0);
    rect(this.x + 2, this.y + 2, this.w - 4, this.h - this.h * 0.6);
    fill(255)
    strokeWeight(0);
    stroke(0);
    textStyle(BOLD)
    textSize(cardTextSize);
    textAlign(CENTER);
    text(this.name, this.x + this.w / 2, this.y + this.h * 0.2);
    fill(0)
    textAlign(CENTER);
    text(this.price, this.x + this.w / 2, this.y + this.h * 0.9);
  }
}

//FUNCTIONS
function mousePressed() {

  //CALCULATE THE ROLL AND MOVE THE TOKEN
  if (mouseX > rollButtonX &&
    mouseX < rollButtonX + rollButtonW &&
    mouseY > rollButtonY &&
    mouseY < rollButtonY + rollButtonH) {

    diceNumber = roll();
    calcRoll(turnNumber, diceNumber);

    //HIDE ROLL BUTTON IF NOT DOUBLES

    console.log("doubleDice: " + doubleDice)
    if(doubleDice == 0){
      rollButtonW = 0;
      rollButtonH = 0;
      rollButtonText = "";
    }
  }


  //BUY PROPERTY STEP
  if (mouseX > buyButtonX &&
    mouseX < buyButtonX + buyButtonW &&
    mouseY > buyButtonY &&
    mouseY < buyButtonY + buyButtonH) {
    if (turnNumber == 0) {
      buyProperty(allTokens[0].currentPosition, turnNumber)
    } else if (turnNumber == 1) {
      buyProperty(allTokens[1].currentPosition, turnNumber)
    } else if (turnNumber == 2) {
      buyProperty(allTokens[2].currentPosition, turnNumber)
    } else if (turnNumber == 3) {
      buyProperty(allTokens[3].currentPosition, turnNumber)
    }
  }


    //ADVANCE TO THE NEXT PLAYER'S TURN
  if (mouseX > endButtonX &&
    mouseX < endButtonX + endButtonW &&
    mouseY > endButtonY &&
    mouseY < endButtonY + endButtonH) {

    doubleDice = 0;

    rollButtonW = 100;
    rollButtonH = 100;
    rollButtonText = "ROLL"

    buyButtonText = "BUY"
    buyButtonW = 100;
    buyButtonH = 100;


    if (turnNumber <= 2) {
      turnNumber += 1
    } else {
      turnNumber = 0;
    }
    console.log("Turn number: " + turnNumber)
  }
}

function roll() {
  // die1 = dieFaces[Math.floor(Math.random() * dieFaces.length)];
  // die2 = dieFaces[Math.floor(Math.random() * dieFaces.length)];
  die1 = 6
  die2 = 6
  rollVal = die1 + die2
  console.log(die1);
  console.log(die2);
  return rollVal
}

function calcRoll(turnNumber, diceNumber) {
  console.log(die1)
  console.log(die2)
  //Check for doubles
  if(die1 == die2){
    doubleDice += 1;
    console.log("doubleDice: " + doubleDice)

  }
  if (doubleDice == 3){
    allTokens[turnNumber].currentPosition = 10
    allPlayers[turnNumber].inJail = 1
    moveToken(turnNumber, allTokens[turnNumber].currentPosition,allPlayers[turnNumber].inJail)
    allPlayers[turnNumber].playerPosition = allTokens[turnNumber].currentPosition
  }

  else{
    rollButtonW = 100;
    rollButtonH = 100;
    rollButtonText = "ROLL"


    allTokens[turnNumber].currentPosition = allTokens[turnNumber].currentPosition + diceNumber
    //if player lands on go to jail
    if(allTokens[turnNumber].currentPosition == 30){
      allTokens[turnNumber].currentPosition = 10
      allPlayers[turnNumber].inJail = 1
    }
    //if player passes go
    if (allTokens[turnNumber].currentPosition > 39) {
      allTokens[turnNumber].currentPosition = allTokens[turnNumber].currentPosition - 39
      allPlayers[turnNumber].cash += 200
    }
    moveToken(turnNumber, allTokens[turnNumber].currentPosition,allPlayers[turnNumber].inJail)
    allPlayers[turnNumber].playerPosition = allTokens[turnNumber].currentPosition
  }
}

function moveToken(turnNumber, currentPosition,inJail) {
  var jailShiftX = 0;
  var jailShiftY = 0;

  if (inJail == 1){
    jailShiftX = 10;
    jailShiftY = 25;
  }

  if (turnNumber == 0) {
    allTokens[0].x = allProperties[currentPosition].x + 15 + jailShiftX
    allTokens[0].y = allProperties[currentPosition].y + 55 - jailShiftY
  } else if (turnNumber == 1) {
    allTokens[1].x = allProperties[currentPosition].x + 30 + jailShiftX
    allTokens[1].y = allProperties[currentPosition].y + 55 - jailShiftY
  } else if (turnNumber == 2) {
    allTokens[2].x = allProperties[currentPosition].x + 45 + jailShiftX
    allTokens[2].y = allProperties[currentPosition].y + 55 - jailShiftY
  } else if (turnNumber == 3) {
    allTokens[3].x = allProperties[currentPosition].x + 60 + jailShiftX
    allTokens[3].y = allProperties[currentPosition].y + 55 - jailShiftY
  }
  //PAY RENT STEP
  if (turnNumber == 0) {
    payRent(allTokens[0].currentPosition, turnNumber,rollVal)
  } else if (turnNumber == 1) {
    payRent(allTokens[1].currentPosition, turnNumber,rollVal)
  } else if (turnNumber == 2) {
    payRent(allTokens[2].currentPosition, turnNumber,rollVal)
  } else if (turnNumber == 3) {
    payRent(allTokens[3].currentPosition, turnNumber,rollVal)
  }

}



function buyProperty(tokenPosition, turnNumber) {
  if (allProperties[tokenPosition].owner == 99 && allPlayers[turnNumber].cash >= allProperties[tokenPosition].price) {
    allPlayers[turnNumber].propertiesOwned.push(allProperties[tokenPosition].name)
    allPlayers[turnNumber].cash = allPlayers[turnNumber].cash - allProperties[tokenPosition].price
		allProperties[tokenPosition].owner = turnNumber
    console.log("Player " + (turnNumber) +" bought "+ allProperties[tokenPosition].name)
    allPlayers[turnNumber].propertiesOwned.push(allProperties[tokenPosition])


  }
  else {
    console.log("not buyable")
    if(allPlayers[turnNumber].cash < allProperties[tokenPosition].price){
      console.log("insufficient funds")
    }
  }
}

function payRent(tokenPosition, turnNumber, rollNumber){
  // console.log("Turn Number: " + turnNumber)
  // console.log("Token Position: " + tokenPosition)
  // console.log("Property Owner: " + allProperties[tokenPosition].owner)
  // console.log("Property Color " + allProperties[tokenPosition].color)
  console.log("Player " + (turnNumber) + " landed on player " + allProperties[tokenPosition].owner + "'s property")
  // console.log("This is a " + allProperties[tokenPosition].color + " property")

  var colorCount = 0;
  var rentMultiplier = 1;

  if(allProperties[tokenPosition].owner < 99){
    for(var i = 0; i < allPlayers[allProperties[tokenPosition].owner].propertiesOwned.length;i++){
        if(allPlayers[allProperties[tokenPosition].owner].propertiesOwned[i].color == allProperties[tokenPosition].color){
          colorCount += 1
      }
    }

    //regular property multiplier
    if(allProperties[tokenPosition].color != "black" && allProperties[tokenPosition].color != "white"){
      if(colorCount == 3){
        rentMultiplier = 2
      }
    }

    //Railroad Multiplier
    else if(allProperties[tokenPosition].color == "black"){
      if(colorCount == 2){
          rentMultiplier = 2
      }else if(colorCount == 3){
          rentMultiplier = 3
      }else if(colorCount == 4){
          rentMultiplier = 4
      }
    }
    //utility Multiplier
    if(allProperties[tokenPosition].color == "white"){
      if(colorCount == 2){
        rentMultiplier = 2
      }
    }
  }

  if(allProperties[tokenPosition].owner != turnNumber && allProperties[tokenPosition].owner != 99  && allProperties[tokenPosition].owner != 9000){
    if (allProperties[tokenPosition].color != "white"){
      allPlayers[turnNumber].cash -= allProperties[tokenPosition].rent * rentMultiplier
      allPlayers[allProperties[tokenPosition].owner].cash += allProperties[tokenPosition].rent * rentMultiplier
      console.log("Player " + (turnNumber) + " paid $"+ (allProperties[tokenPosition].rent * rentMultiplier) + " rent to " + allProperties[tokenPosition].owner)

    }
    else{
      allPlayers[turnNumber].cash -= allProperties[tokenPosition].rent * rollVal * rentMultiplier
      allPlayers[allProperties[tokenPosition].owner].cash += allProperties[tokenPosition].rent * rollVal * rentMultiplier
      console.log("Player " + (turnNumber) + " paid $"+ (allProperties[tokenPosition].rent * rollVal * rentMultiplier) + " rent to " + allProperties[tokenPosition].owner)

    }
  }

}

function drawToken(x, y, tokenColor, player) {
  strokeWeight(25);
  stroke(tokenColor)
  point(x, y)
  textAlign(CENTER);
  strokeWeight(0);
  text(player, x, y+5);
  stroke(0)
}

function drawMsgBox(diceNumber) {
  fill(255, 255, 255);
  rect(canvasWidth - canvasWidth * 0.6, canvasHeight - canvasHeight * 0.35, canvasWidth - canvasWidth * 0.8, 25);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text(diceNumber, canvasWidth / 2, canvasHeight - canvasHeight * 0.35 + 20);
}

function drawTurnBox(turnNumber) {
  fill(255, 255, 255);
  rect(canvasWidth - canvasWidth * 0.6, canvasHeight - canvasHeight * 0.85, canvasWidth - canvasWidth * 0.8, 25);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text("Player " + (turnNumber) + "'s Turn", canvasWidth / 2, canvasHeight - canvasHeight * 0.85 + 20);
}

function drawRollButton() {
  fill(0)
  rect(rollButtonX, rollButtonY, rollButtonW, rollButtonH)
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text(rollButtonText, rollButtonX + rollButtonH / 2, rollButtonY + rollButtonW / 2);
}

function drawBuyButton() {
  fill(0)
  rect(buyButtonX, buyButtonY, buyButtonW, buyButtonH)
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text(buyButtonText, buyButtonX + buyButtonH / 2, buyButtonY + buyButtonW / 2);
}

function drawEndButton() {
  fill(0)
  rect(endButtonX, endButtonY, endButtonW, endButtonH)
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text("END", endButtonX + endButtonH / 2, endButtonY + endButtonW / 2);
}

function drawSmallCard(x,y,color){
    stroke(0);
    strokeWeight(1);
    fill(color);
    rect(x, y, smallCardSize, smallCardSize);
    strokeWeight(0);
    stroke(0);
}

function drawPlayer1Box() {

  xshift = 0;
  yshift = 0;
  count = 0;

  fill(255, 255, 255);
  rect(p1BoxX, p1BoxY, p1BoxWidth, p1BoxHeight);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text("Player 1: " + allPlayers[0].name, canvasWidth - canvasWidth * 0.86 + 75, canvasHeight - canvasHeight * 0.78);
  text("Cash: " + allPlayers[0].cash, canvasWidth - canvasWidth * 0.86 + 75, canvasHeight - canvasHeight * 0.78 + 25);

  for (var i = 0; i < allProperties.length; i++) {
    if (allProperties[i].owner == 0){
      smallCardColor = allProperties[i].color
    }
    else{
      smallCardColor = "lightgrey"
    }

    drawSmallCard(p1BoxX+ p1BoxWidth*0.05 + xshift, p1BoxY + p1BoxHeight*0.3 + yshift,smallCardColor);
    yshift = yshift + 20;
    count+=1

    if(count== 6 || count==12|| count==18|| count==24 || count ==30 || count==36){
      xshift += 20;
      yshift = 0;
    }
  }
}

function drawPlayer2Box() {

  xshift = 0;
  yshift = 0;
  count = 0;

  fill(255, 255, 255);
  rect(p2BoxX, p2BoxY, p2BoxWidth, p2BoxHeight);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text("Player 2:" + allPlayers[1].name, canvasWidth - canvasWidth * 0.68 + 75, canvasHeight - canvasHeight * 0.78);
  text("Cash: " + allPlayers[1].cash, canvasWidth - canvasWidth * 0.68 + 75, canvasHeight - canvasHeight * 0.78 + 25);

  for (var i = 0; i < allProperties.length; i++) {
    if (allProperties[i].owner == 1){
      smallCardColor = allProperties[i].color
    }
    else{
      smallCardColor = "lightgrey"
    }

    drawSmallCard(p2BoxX+ p2BoxWidth*0.05 + xshift, p2BoxY + p2BoxHeight*0.3 + yshift,smallCardColor);
    yshift = yshift + 20;
    count+=1

    if(count== 6 || count==12|| count==18|| count==24 || count ==30 || count==36){
      xshift += 20;
      yshift = 0;
    }
  }
}

function drawPlayer3Box() {

  xshift = 0;
  yshift = 0;
  count = 0;

  fill(255, 255, 255);
  rect(p3BoxX, p3BoxY, p3BoxWidth, p3BoxHeight);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text("Player 3:" + allPlayers[2].name, canvasWidth - canvasWidth * 0.50 + 75, canvasHeight - canvasHeight * 0.78);
  text("Cash: " + allPlayers[2].cash, canvasWidth - canvasWidth * 0.50 + 75, canvasHeight - canvasHeight * 0.78 + 25);

  for (var i = 0; i < allProperties.length; i++) {
    if (allProperties[i].owner == 2){
      smallCardColor = allProperties[i].color
    }
    else{
      smallCardColor = "lightgrey"
    }

    drawSmallCard(p3BoxX+ p3BoxWidth*0.05 + xshift, p3BoxY + p3BoxHeight*0.3 + yshift,smallCardColor);
    yshift = yshift + 20;
    count+=1

    if(count== 6 || count==12|| count==18|| count==24 || count ==30 || count==36){
      xshift += 20;
      yshift = 0;
    }
  }
}

function drawPlayer4Box() {

  xshift = 0;
  yshift = 0;
  count = 0;

  fill(255, 255, 255);
  rect(p4BoxX, p4BoxY, p4BoxWidth, p4BoxHeight);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text("Player 4:" + allPlayers[3].name, canvasWidth - canvasWidth * 0.32 + 75, canvasHeight - canvasHeight * 0.78);
  text("Cash: " + allPlayers[3].cash, canvasWidth - canvasWidth * 0.32 + 75, canvasHeight - canvasHeight * 0.78 + 25);

  for (var i = 0; i < allProperties.length; i++) {
    if (allProperties[i].owner == 3){
      smallCardColor = allProperties[i].color
    }
    else{
      smallCardColor = "lightgrey"
    }

    drawSmallCard(p4BoxX+ p4BoxWidth*0.05 + xshift, p4BoxY + p4BoxHeight*0.3 + yshift,smallCardColor);
    yshift = yshift + 20;
    count+=1

    if(count== 6 || count==12|| count==18|| count==24 || count ==30 || count==36){
      xshift += 20;
      yshift = 0;
    }
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);


  allProperties.push(new Property(775, 800, cardWidth, cardHeight, "", "Go", "grey", 0, 0, 9000, 0));

  allProperties.push(new Property(700, 800, cardWidth, cardHeight, 60, "Mediterranean\n Avenue", "brown", 1, 1, 99, 2));
  allProperties.push(new Property(625, 800, cardWidth, cardHeight, "", "Community\n Chest", "Grey", 2, 0, 9000, 0));
  allProperties.push(new Property(550, 800, cardWidth, cardHeight, 60, "Baltic\n Avenue", "brown", 3, 1, 99, 4));
  allProperties.push(new Property(475, 800, cardWidth, cardHeight, "", "Income\n Tax", "Grey", 4, 0, 9000, 0));
  allProperties.push(new Property(400, 800, cardWidth, cardHeight, 200, "Reading\n Railroad", "black", 5, 1, 99, 25));
  allProperties.push(new Property(325, 800, cardWidth, cardHeight, 100, "Oriental\n Avenue", "lightblue", 6, 1, 99, 6));
  allProperties.push(new Property(250, 800, cardWidth, cardHeight, "", "Chance\n", "Grey", 7, 0, 9000, 0));
  allProperties.push(new Property(175, 800, cardWidth, cardHeight, 100, "Vermont\n Avenue", "lightblue", 8, 1, 99, 6));
  allProperties.push(new Property(100, 800, cardWidth, cardHeight, 120, "Connecticut\n Avenue", "lightblue", 9, 1, 99, 8));

  allProperties.push(new Property(25, 800, cardWidth, cardHeight, "", "Jail\n", "Grey", 10, 0, 9000, 0));

  allProperties.push(new Property(25, 725, cardWidth, cardHeight, 140, "St. Charles\n Place", "magenta", 11, 1, 99, 10));
  allProperties.push(new Property(25, 650, cardWidth, cardHeight, 150, "Electric\n Company", "white", 12, 1, 99, 1));
  allProperties.push(new Property(25, 575, cardWidth, cardHeight, 140, "States\n Avenue", "magenta", 13, 1, 99, 10));
  allProperties.push(new Property(25, 500, cardWidth, cardHeight, 160, "Virginia\n Avenue", "magenta", 14, 1, 99, 12));
  allProperties.push(new Property(25, 425, cardWidth, cardHeight, 200, "Pennsylvania\n Railroad", "black", 15, 1, 99, 25));
  allProperties.push(new Property(25, 350, cardWidth, cardHeight, 180, "St. James\n Place", "orange", 16, 1, 99, 14));
  allProperties.push(new Property(25, 275, cardWidth, cardHeight, "", "Community\n Chest", "Grey", 17, 0, 9000, 0));
  allProperties.push(new Property(25, 200, cardWidth, cardHeight, 180, "Tennessee\n Avenue", "orange", 18, 1, 99, 14));
  allProperties.push(new Property(25, 125, cardWidth, cardHeight, 200, "New York\n Avenue", "orange", 19, 1, 99, 16));

  allProperties.push(new Property(25, 50, cardWidth, cardHeight, "", "Free\n Parking", "grey", 20, 0, 9000, 0));

  allProperties.push(new Property(100, 50, cardWidth, cardHeight, 220, "Kentucky\n Avenue", "red", 21, 1, 99, 18));
  allProperties.push(new Property(175, 50, cardWidth, cardHeight, "", "Chance\n", "Grey", 22, 0, 9000, 0));
  allProperties.push(new Property(250, 50, cardWidth, cardHeight, 240, "Indiana\n Avenue", "red", 23, 1, 99, 18));
  allProperties.push(new Property(325, 50, cardWidth, cardHeight, 260, "Illinois\n Avenue", "red", 24, 1, 99, 20));
  allProperties.push(new Property(400, 50, cardWidth, cardHeight, 200, "B.&O.\n Railroad", "black", 25, 1, 99, 25));
  allProperties.push(new Property(475, 50, cardWidth, cardHeight, 260, "Atlantic\n Avenue", "yellow", 26, 1, 99, 22));
  allProperties.push(new Property(550, 50, cardWidth, cardHeight, 260, "Ventnor\n Avenue", "yellow", 27, 1, 99, 22));
  allProperties.push(new Property(625, 50, cardWidth, cardHeight, 150, "Water\n Works", "white", 28, 1, 99, 1));
  allProperties.push(new Property(700, 50, cardWidth, cardHeight, 280, "Marvin\n Gardens", "yellow", 29, 1, 99, 24));

  allProperties.push(new Property(775, 50, cardWidth, cardHeight, "", "Go to\n Jail", "grey", 30, 0, 9000, 0));

  allProperties.push(new Property(775, 125, cardWidth, cardHeight, 300, "Pacific\n Avenue", "green", 31, 1, 99, 26));
  allProperties.push(new Property(775, 200, cardWidth, cardHeight, 300, "North Carolina\n Avenue", "green", 32, 1, 99, 26));
  allProperties.push(new Property(775, 275, cardWidth, cardHeight, "", "Community\n Chest", "Grey", 33, 0, 9000, 0));
  allProperties.push(new Property(775, 350, cardWidth, cardHeight, 320, "Pennsylvania\n Avenue", "green", 34, 1, 99, 28));
  allProperties.push(new Property(775, 425, cardWidth, cardHeight, 200, "Short Line\n Railroad", "black", 35, 1, 99, 25));
  allProperties.push(new Property(775, 500, cardWidth, cardHeight, "", "Chance\n", "Grey", 36, 0, 9000, 0));
  allProperties.push(new Property(775, 575, cardWidth, cardHeight, 350, "Park Place\n", "blue", 37, 1, 99, 35));
  allProperties.push(new Property(775, 650, cardWidth, cardHeight, "", "Luxury\n Tax", "grey", 38, 0, 9000, 0));
  allProperties.push(new Property(775, 725, cardWidth, cardHeight, 400, "Boardwalk\n", "blue", 39, 1, 99, 50));

  allPlayers.push(new Player("AJ", 500, 0, [], 0));
  allPlayers.push(new Player("Duckie", 500, 0, [],0));
  allPlayers.push(new Player("Peter", 500, 0, [], 0));
  allPlayers.push(new Player("Bryce", 500, 0, [], 0));


  allTokens.push(new Token(790, 845, 0,"red"));
  allTokens.push(new Token(805, 845, 0,"blue"));
  allTokens.push(new Token(820, 845, 0,"green"));
  allTokens.push(new Token(835, 845, 0,"yellow"));

  diceNumber = 0

}

function draw() {
  background(200);

  drawRollButton();
  drawBuyButton();
  drawEndButton();

	for (let property of allProperties) {
    property.drawCard()
  }

	drawPlayer1Box()
  drawPlayer2Box()
  drawPlayer3Box()
  drawPlayer4Box()

	drawMsgBox(diceNumber)
  drawTurnBox(turnNumber)

	drawToken(allTokens[0].x, allTokens[0].y, allTokens[0].tokenColor,"1")
  drawToken(allTokens[1].x, allTokens[1].y, allTokens[1].tokenColor,"2")
  drawToken(allTokens[2].x, allTokens[2].y, allTokens[2].tokenColor,"3")
  drawToken(allTokens[3].x, allTokens[3].y, allTokens[3].tokenColor,"4")

	strokeWeight(0);
}
