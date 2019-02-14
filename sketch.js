// To do:

// PRIORITY:
// - Jail
// - houses, hotels
// - chance and community cards:
//      - house repairs
//      - get out of jail free cards
// - bankrupt system
// - mortgaging
// - trading

// NOT A PRIORITY
// - event log
// - write a function for cash transfers e.g. cashTransfer(sender, recipient, amount)

var allPlayers = [];
var allProperties = [];
var allTokens = [];
var dieFaces = [1, 2, 3, 4, 5, 6];
var die1 = 0;
var die2 = 0;
var diceNumber = 0;

let doublesThrown = 0;
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

var drawnCardNum = 0;
var chanceMultiplier = 1;

var message = 0;
var turnNumber = 0;

var chanceCards = ["Advance to Go (Collect $200)",
                  "Advance to Illinois Ave—If you pass Go, collect $200",
                  "Advance to St. Charles Place – If you pass Go, collect $200",
                  "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
                  "Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.",
                  "Bank pays you dividend of $50",
                  "Get Out of Jail Free",
                  "Go Back 3 Spaces",
                  "Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200",
                  "Make general repairs on all your property–For each house pay $25–For each hotel $100",
                  "Pay poor tax of $15",
                  "Take a trip to Reading Railroad–If you pass Go, collect $200",
                  "Take a walk on the Boardwalk–Advance token to Boardwalk",
                  "You have been elected Chairman of the Board–Pay each player $50",
                  "Your building and loan matures—Collect $150",
                  "You have won a crossword competition—Collect $100"]

var communityCards = ["Advance to Go (Collect $200)",
                      "Bank error in your favor—Collect $200",
                      "Doctor's fee—Pay $50",
                      "From sale of stock you get $50",
                      "Get Out of Jail Free",
                      "Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200",
                      "Grand Opera Night—Collect $50 from every player for opening night seats",
                      "Holiday Fund matures—Receive $100",
                      "Income tax refund–Collect $20",
                      "It is your birthday—Collect $10",
                      "Life insurance matures–Collect $100",
                      "Pay hospital fees of $100",
                      "Pay school fees of $150",
                      "Receive $25 consultancy fee",
                      "You are assessed for street repairs–$40 per house–$115 per hotel",
                      "You have won second prize in a beauty contest–Collect $10",
                      "You inherit $100"]


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

    hideRollButton()
    diceNumber = roll();
    calcRoll(turnNumber, diceNumber);
  }

  //BUY PROPERTY STEP
  if (mouseX > buyButtonX &&
    mouseX < buyButtonX + buyButtonW &&
    mouseY > buyButtonY &&
    mouseY < buyButtonY + buyButtonH) {

      buyProperty(allTokens[turnNumber].currentPosition, turnNumber)

  }

    //ADVANCE TO THE NEXT PLAYER'S TURN
  if (mouseX > endButtonX &&
    mouseX < endButtonX + endButtonW &&
    mouseY > endButtonY &&
    mouseY < endButtonY + endButtonH) {

    doublesThrown = 0;
    chanceMultiplier = 0;

    showRollButton()

    showBuyButton()

    if (turnNumber <= 2) {
      turnNumber += 1
    } else {
      turnNumber = 0;
    }
  }
}

function hideRollButton() {
  rollButtonW = 0;
  rollButtonH = 0;
  rollButtonText = ""
}

function showRollButton() {
  rollButtonW = 100;
  rollButtonH = 100;
  rollButtonText = "ROLL"
}

function hideBuyButton() {
  buyButtonW = 0;
  buyButtonH = 0;
  buyButtonText = ""
}

function showBuyButton() {
  buyButtonW = 100;
  buyButtonH = 100;
  buyButtonText = "BUY"
}

function roll() {
  // die1 = dieFaces[Math.floor(Math.random() * dieFaces.length)];
  // die2 = dieFaces[Math.floor(Math.random() * dieFaces.length)];
  die1 = 5
  die2 = 6
  rollVal = die1 + die2
  console.log("Player " + turnNumber + " rolled a " + (die1 + die2) + "(" + die1 + "+" + die2 + ")")

  return rollVal
}

function calcRoll(turnNumber, diceNumber) {

  allTokens[turnNumber].currentPosition = allTokens[turnNumber].currentPosition + diceNumber

  //if player lands on chanceCards
  if(allTokens[turnNumber].currentPosition == 7 || allTokens[turnNumber].currentPosition == 22 || allTokens[turnNumber].currentPosition == 36){

    selectCard("Chance")
    console.log("Player " + turnNumber + " draws a Chance card (#" + drawnCardNum + ")")
  }

  //if player lands on Community Chest
  if(allTokens[turnNumber].currentPosition == 2 || allTokens[turnNumber].currentPosition == 17 || allTokens[turnNumber].currentPosition == 33){
    selectCard("Community")
    console.log("Player " + turnNumber + " draws a Community Chest card (#" + drawnCardNum + ")")
  }

  //Check for doubles
  if(die1 == die2){
    doublesThrown += 1;
    showRollButton()
    console.log("Player " + turnNumber + " rolled doubles (" + die1 + "+" + die2 + ")")
  }

  //if player rolls 3 doubles
  if (doublesThrown == 3){
    allTokens[turnNumber].currentPosition = 10
    allPlayers[turnNumber].inJail = 1
    doublesThrown = 0;
    console.log("Player " + turnNumber + " rolled 3 doubles in a row. Go to jail!")
  }

  //Draw the token on the board
  placeToken(turnNumber, allTokens[turnNumber].currentPosition)
  allPlayers[turnNumber].playerPosition = allTokens[turnNumber].currentPosition
  console.log("Player " + turnNumber + " landed on " + allProperties[allTokens[turnNumber].currentPosition].name)

  //if player lands on go to jail
  if(allTokens[turnNumber].currentPosition == 30){
    allTokens[turnNumber].currentPosition = 10
    allPlayers[turnNumber].inJail = 1
    console.log("Player " + turnNumber + " has been sent to Jail")
  }

  //if player passes go
  if (allTokens[turnNumber].currentPosition > 39) {
    allTokens[turnNumber].currentPosition = allTokens[turnNumber].currentPosition - 39
    allPlayers[turnNumber].cash += 200
    console.log("Player " + turnNumber + " receives $200 for passing GO")
  }

  //if player lands on luxury Tax
  if(allTokens[turnNumber].currentPosition == 4 || allTokens[turnNumber].currentPosition == 38){
    allPlayers[turnNumber].cash -= 200
    console.log("Player " + turnNumber + " paid $200 in taxes")
  }




}

function placeToken(turnNumber, currentPosition) {

  if(turnNumber == 0){
    playerShift = 15;
  }
  else if(turnNumber ==1){
    playerShift = 25;
  }
  else if(turnNumber == 2){
    playerShift = 35;
  }
  else if(turnNumber == 3){
    playerShift = 45;
  }

  allTokens[turnNumber].x = allProperties[currentPosition].x + 15 + playerShift
  allTokens[turnNumber].y = allProperties[currentPosition].y + 45

  console.log("Token " + turnNumber + "(" + allTokens[turnNumber].x + "," + allTokens[turnNumber].y + ")")

  //PAY RENT STEP
  payRent(allTokens[turnNumber].currentPosition, turnNumber,rollVal)
}

function buyProperty(tokenPosition, turnNumber) {

  if (allProperties[tokenPosition].owner == 99 && allPlayers[turnNumber].cash >= allProperties[tokenPosition].price) {
    allPlayers[turnNumber].propertiesOwned.push(allProperties[tokenPosition].name)
    allPlayers[turnNumber].cash = allPlayers[turnNumber].cash - allProperties[tokenPosition].price
		allProperties[tokenPosition].owner = turnNumber
    allPlayers[turnNumber].propertiesOwned.push(allProperties[tokenPosition])
    console.log("Player " + (turnNumber) +" bought "+ allProperties[tokenPosition].name)
  }

  else {
    console.log("not buyable")
    if(allPlayers[turnNumber].cash < allProperties[tokenPosition].price){
      console.log("insufficient funds")
    }
  }
}

function payRent(tokenPosition, turnNumber, rollNumber){

  console.log("Player " + (turnNumber) + " landed on player " + allProperties[tokenPosition].owner + "'s property")

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
        rentMultiplier = 2;
      }
    }

    //Railroad Multiplier
    else if(allProperties[tokenPosition].color == "black"){
      if(colorCount == 2){
          rentMultiplier = 2;
      }else if(colorCount == 3){
          rentMultiplier = 3;
      }else if(colorCount == 4){
          rentMultiplier = 4;
      }
    }
    //utility Multiplier
    if(allProperties[tokenPosition].color == "white"){
      if(colorCount == 2){
        rentMultiplier = 2;
      }
    }
  }

  if(allProperties[tokenPosition].owner != turnNumber && allProperties[tokenPosition].owner != 99  && allProperties[tokenPosition].owner != 9000){
    if (allProperties[tokenPosition].color != "white"){
      allPlayers[turnNumber].cash -= allProperties[tokenPosition].rent * rentMultiplier * chanceMultiplier
      allPlayers[allProperties[tokenPosition].owner].cash += allProperties[tokenPosition].rent * rentMultiplier * chanceMultiplier
      console.log("Player " + (turnNumber) + " paid $"+ (allProperties[tokenPosition].rent * rentMultiplier * chanceMultiplier) + " rent to " + allProperties[tokenPosition].owner)

    }
    else{
      allPlayers[turnNumber].cash -= allProperties[tokenPosition].rent * rollVal * rentMultiplier * chanceMultiplier
      allPlayers[allProperties[tokenPosition].owner].cash += allProperties[tokenPosition].rent * rollVal * rentMultiplier * chanceMultiplier
      console.log("Player " + (turnNumber) + " paid $"+ (allProperties[tokenPosition].rent * rollVal * rentMultiplier * chanceMultiplier) + " rent to " + allProperties[tokenPosition].owner)

    }
  }

}

// Take a chance or community chest card

function selectCard(type){
  if(type == "Chance"){
    // drawnCardNum = Math.floor(Math.random() * chanceCards.length);
    // drawnCardNum = Math.floor(Math.random() * 16);
    drawnCardNum = floor(random(12,14));
    drawnCardText = chanceCards[drawnCardNum];
    console.log(chanceCards[drawnCardNum]);

    //Advance to Go (Collect $200)
    if(drawnCardNum == 0){
      allTokens[turnNumber].currentPosition = 0;
      allPlayers[turnNumber].cash += 200;
    }

    else if(drawnCardNum == 1){
          // console.log("Advance to Illinois Ave—If you pass Go, collect $200")
      allTokens[turnNumber].currentPosition = 24;
      if(allTokens[turnNumber].currentPosition > 24){
        allPlayers[turnNumber].cash += 200;
      }
    }

    else if(drawnCardNum == 2){
            // console.log("Advance to St. Charles Place – If you pass Go, collect $200")
      allTokens[turnNumber].currentPosition = 11;
      if(allTokens[turnNumber].currentPosition > 11){
        allPlayers[turnNumber].cash += 200;
      }
    }

    else if(drawnCardNum == 3){
      // console.log("Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.")
      if(allTokens[turnNumber].currentPosition < 12 || allTokens[turnNumber].currentPosition > 28){
        allTokens[turnNumber].currentPosition = 12;
      }
      else if(allTokens[turnNumber].currentPosition > 12 && allTokens[turnNumber].currentPosition < 28){
        allTokens[turnNumber].currentPosition = 28;
      }
      rentMultiplier = 2;
    }

    else if(drawnCardNum == 4){
      // console.log("Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.","Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.","Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.")
      if(allTokens[turnNumber].currentPosition < 10 ||  allTokens[turnNumber].currentPosition > 35){
        allTokens[turnNumber].currentPosition = 5;
      }
      else if(allTokens[turnNumber].currentPosition < 15 && allTokens[turnNumber].currentPosition > 5){
        allTokens[turnNumber].currentPosition = 15;
      }
      else if(allTokens[turnNumber].currentPosition < 25 && allTokens[turnNumber].currentPosition >15){
        allTokens[turnNumber].currentPosition = 25;
      }
      else if(allTokens[turnNumber].currentPosition < 35 && allTokens[turnNumber].currentPosition >25){
        allTokens[turnNumber].currentPosition = 35;
      }
    rentMultiplier = 2;
    }
    else if(drawnCardNum == 5){
      // console.log("Bank pays you dividend of $50")
      allPlayers[turnNumber].cash += 50;
    }
    else if(drawnCardNum == 6){
      // console.log("Get Out of Jail Free")
    }
    else if(drawnCardNum == 7){
      // console.log("Go Back 3 Spaces")
      allPlayers[turnNumber].cash += 50;
    }
    else if(drawnCardNum == 8){
      // console.log("Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200")
      allTokens[turnNumber].currentPosition = 10;
      allPlayers.inJail = 1
    }
    else if(drawnCardNum == 9){
      // console.log("Make general repairs on all your property–For each house pay $25–For each hotel $100")
    }
    else if(drawnCardNum == 10){
      // console.log("Pay poor tax of $15")
      allPlayers[turnNumber].cash -= 15;
    }
    else if(drawnCardNum == 11){
      // console.log("Take a trip to Reading Railroad–If you pass Go, collect $200")
      allTokens[turnNumber].currentPosition = 5;
      if(allTokens[turnNumber].currentPosition > 5){
        allPlayers[turnNumber].cash += 200;
      }
    }
    else if(drawnCardNum == 12){
      // console.log("Take a walk on the Boardwalk–Advance token to Boardwalk")
      allTokens[turnNumber].currentPosition = 39;
    }
    else if(drawnCardNum == 13){
      // console.log("You have been elected Chairman of the Board–Pay each player $50")
      for(var i = 0; i < allPlayers.length-1; i++){
        allPlayers[turnNumber].cash -= 50;
        if(i != turnNumber){
          allPlayers[i].cash += 50
        }
      }
    }
    else if(drawnCardNum == 14){
      // console.log("Your building and loan matures—Collect $150")
      allPlayers[turnNumber].cash += 150;
    }
    else if(drawnCardNum == 15){
      // console.log("You have won a crossword competition—Collect $100")
      allPlayers[turnNumber].cash += 100;
    }
  }

  //Community Chest cards

  if(type == "Community"){
    // drawnCardNum = Math.floor(Math.random() * chanceCards.length);
    // drawnCardNum = Math.floor(Math.random() * 16);
    drawnCardNum = floor(random(1,14));
    drawnCardText = communityCards[drawnCardNum];
    console.log(communityCards[drawnCardNum]);

    //Advance to Go (Collect $200)
    if(drawnCardNum == 0){
      // console.log("Advance to Go, collect $200")
      allTokens[turnNumber].currentPosition = 0;
      allPlayers[turnNumber].cash += 200;
    }
    else if(drawnCardNum == 1){
      // console.log("Bank error in your favor - Collect $200")
      allPlayers[turnNumber].cash += 200;
    }
    else if(drawnCardNum == 2){
      // console.log("Doctor's fee - Pay $50")
      allPlayers[turnNumber].cash += 50;
    }
    else if(drawnCardNum == 3){
      // console.log("From sale of stock you get $50")
      allPlayers[turnNumber].cash += 200;
    }
    else if(drawnCardNum == 4){
      // console.log("Get Out of Jail Free")
    }
    else if(drawnCardNum == 5){
      // console.log("Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200")
      allTokens[turnNumber].currentPosition = 10;
      allPlayers.inJail = 1
    }
    else if(drawnCardNum == 6){
      // console.log("Grand Opera Night - collect $50 from each player")
      for(var i = 0; i < allPlayers.length-1; i++){
        allPlayers[turnNumber].cash += 50;
        if(i != turnNumber){
          allPlayers[i].cash -= 50
        }
      }
    }
    else if(drawnCardNum == 7){
      // console.log("Holiday Fund matures—Receive $100")
      allPlayers[turnNumber].cash += 100;
    }
    else if(drawnCardNum == 8){
      // console.log("Income tax refund–Collect $20")
      allPlayers[turnNumber].cash += 20;
    }
    else if(drawnCardNum == 9){
      // console.log("It is your birthday—Collect $10")
      allPlayers[turnNumber].cash += 10;
    }
    else if(drawnCardNum == 10){
      // console.log("Life insurance matures–Collect $100")
      allPlayers[turnNumber].cash += 100;
    }
    else if(drawnCardNum == 11){
      // console.log("Pay hospital fees of $100")
      allPlayers[turnNumber].cash -= 100;
    }
    else if(drawnCardNum == 12){
      // console.log("Receive $25 consultancy fee")
      allPlayers[turnNumber].cash += 25;
    }
    else if(drawnCardNum == 13){
      // console.log("You are assessed street repairs - $40 per house - $115 per hotel")
    }
    else if(drawnCardNum == 14){
      // console.log("You have won second prize in a beauty contest–Collect $10")
      allPlayers[turnNumber].cash += 10;
    }
    else if(drawnCardNum == 15){
      // console.log("You have won second prize in a beauty contest–Collect $10")
      allPlayers[turnNumber].cash += 10;
    }
    else if(drawnCardNum == 16){
      // console.log("You inherit $100")
      allPlayers[turnNumber].cash += 100;
    }
  }

}

var chanceCards = ["Advance to Go (Collect $200)",
                  "Advance to Illinois Ave—If you pass Go, collect $200",
                  "Advance to St. Charles Place – If you pass Go, collect $200",
                  "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
                  "Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.",
                  "Bank pays you dividend of $50",
                  "Get Out of Jail Free",
                  "Go Back 3 Spaces",
                  "Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200",
                  "Make general repairs on all your property–For each house pay $25–For each hotel $100",
                  "Pay poor tax of $15",
                  "Take a trip to Reading Railroad–If you pass Go, collect $200",
                  "Take a walk on the Boardwalk–Advance token to Boardwalk",
                  "You have been elected Chairman of the Board–Pay each player $50",
                  "Your building and loan matures—Collect $150",
                  "You have won a crossword competition—Collect $100"]

var communityCards = ["Advance to Go (Collect $200)",
                  "Bank error in your favor—Collect $200",
                  "Doctor's fee—Pay $50",
                  "From sale of stock you get $50",
                  "Get Out of Jail Free",
                  "Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200",
                  "Grand Opera Night—Collect $50 from every player for opening night seats",
                  "Holiday Fund matures—Receive $100",
                  "Income tax refund–Collect $20",
                  "It is your birthday—Collect $10",
                  "Life insurance matures–Collect $100",
                  "Pay hospital fees of $100",
                  "Pay school fees of $150",
                  "Receive $25 consultancy fee",
                  "You are assessed for street repairs–$40 per house–$115 per hotel",
                  "You have won second prize in a beauty contest–Collect $10",
                  "You inherit $100"]

function drawToken(x, y, tokenColor, player) {
  strokeWeight(25);
  stroke(tokenColor)
  point(x, y)
  textAlign(CENTER);
  strokeWeight(0);
  text(player, x, y+5);
  stroke(0);
}

function drawMsgBox(diceNumber) {
  fill(255, 255, 255);
  rect(canvasWidth - canvasWidth * 0.6, canvasHeight - canvasHeight * 0.35, canvasWidth - canvasWidth * 0.8, 25);
  fill(0);
  stroke(0);
  textAlign(CENTER);
  textSize(18);
  text(die1 + " + " + die2 + " = " + diceNumber, canvasWidth / 2, canvasHeight - canvasHeight * 0.35 + 20);
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
