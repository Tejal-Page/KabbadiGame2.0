//DECLARING GLOBAL VARIABLES
var player1, p1animation;
var player2, p2animation;
var database;
var position1, position2;
var gameState;
var rand;
var player1Score, player2Score;
function preload(){
    p1animation = loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    p2animation = loadAnimation("assests/player2b.png","assests/player2a.png","assests/player2b.png");
}
function setup(){

    database = firebase.database();
    createCanvas(600,600);
    //PLAYER1 SPRTIES-RED
    player1 = createSprite(300,250,10,10);
    player1.shapeColor="red";
    player1.addAnimation("twisting", p1animation);
    p1animation.frameDelay=200;
    player1.scale= 0.5;
    player1.setCollider("circle", 0,0,50);
    player1.debug=true;
    //PLAYER2 SPRITES- YELLOW
    player2 = createSprite(500,250,10,10);
    player2.shapeColor="red";
    player2.addAnimation("twisting", p2animation);
    p2animation.frameDelay=200;
    player2.scale= -0.5;
    player2.setCollider("circle", 0,0,50);
    player2.debug=true;
    //READING FROM DATABASE- PLAYER POSITION
    var player1Ref = database.ref("player1/position");
    player1Ref.on("value", readPosition1);
    var player2Ref = database.ref("player2/position");
    player2Ref.on("value", readPosition2);
    //READING FROM DATABASE- GAMESTATE
    var gameState= database.ref("gameState");
    gameState.on("value", readGS);

    player1Score = database.ref('player1Score');
    player1Score.on("value",readScore1,showError);

    player2Score = database.ref('player2Score');
    player2Score.on("value",readScore2,showError);
}

function draw(){
    background("white");
//START THE TOSS OF THE GAME TO DECIDE WHICH PLAYER GOES FIRST
    if(gameState===0){
        fill("black");
        text("PLEASE PRESS SPACEBAR TO START THE TOSS", 150,200);
        if(keyDown("space")){
            rand = Math.round(random(1,2)); //GENERATES RAND NUMBER FOR TOSS
            if(rand===1){
                database.ref("/").update({
                    'gameState': 1
                })
                alert("IT'S RED'S TURN");//GIVES A POP UP
            }
            else if(rand===2){
                database.ref("/").update({
                    'gameState': 2
                })
                alert("IT'S YELLOW'S TURN");//GIVES A POP UP
            }
            //UPDATING THE STARTING POSITION OF BOTH PLAYERS
            database.ref("player1/position").update({
                'x':150,
                'y':300
            })
            database.ref("player2/position").update({
                'x':450,
                'y':300
            })

        }
    }
//RESTRICTING THE MOVEMENTS OF PLAYERS DEPENDING UPON WHOSE TURNIT IS
/*
PLAYER WHOSE TURN IT IS WILL MOVE IN ALL DIRECTIONS
PLAYER WHOSE TURN IS NOT THERE WILL ONLY MOVE UP N DOWN
THIS WILL BE VARIED DEPENDING UPON THE GAMESTATES
*/
    if(gameState===1){
        //PLAYER1- MOVEMENTS- ARROW KEYS- ALL DIRECTIONS
        if(keyDown(LEFT_ARROW)){
            writePosition1(-5,0);
        }
        if(keyDown(RIGHT_ARROW)){
            writePosition1(5,0);
        }
        if(keyDown(UP_ARROW)){
            writePosition1(0,-5);
        }
        if(keyDown(DOWN_ARROW)){
            writePosition1(0,5);
        }
        //PLAYER2- MOVEMENTS-WS KEYS- UP AND DOWN ONLY
        if(keyDown("w")){
            writePosition2(0,-5);
        }
        if(keyDown("s")){
            writePosition2(0,5);
        }
        if(player1.x > 500){
            database.ref('/').update({
                'player1Score':player1Score - 5,
                'player2Score':player2Score + 5,
                 'gameState':0
            })
        }
        if(player1.isTouching(player2)){
            database.ref('/').update({
                'player1Score':player1Score + 5,
                'player2Score':player2Score - 5,
                 'gameState':0
            })
            alert("RED LOST THE RIDE")
        }
    }
    if(gameState===2){
        //PLAYER2-MOVEMENTS-wasd keys- ALL DIRECTIONS
        if(keyDown("a")){
            writePosition2(-5,0);
        }
        if(keyDown("d")){
            writePosition2(5,0);
        }
        if(keyDown("w")){
            writePosition2(0,-5);
        }
        if(keyDown("s")){
            writePosition2(0,5);
        }
        //PLAYER1- MOVEMENTS-ARROW KEYS- UP AND DOWN ONLY
        if(keyDown(UP_ARROW)){
            writePosition1(0,-5);
        }
        if(keyDown(DOWN_ARROW)){
            writePosition1(0,5);
        }

        if(player1.x < 150){
            database.ref('/').update({
                'player1Score':player1Score + 5,
                'player2Score':player2Score - 5,
                 'gameState':0
            })
        }
        if(player1.isTouching(player2)){
            database.ref('/').update({
                'player1Score':player1Score - 5,
                'player2Score':player2Score + 5,
                 'gameState':0
            })
            alert("RED LOST THE RIDE")
        }

    }
    textSize(15);
    text("RED: "+ player1Score,350,15);
    text("YELLOW: "+ player2Score,150,15);

    //DRAWING LINES
    drawLine();


    drawSprites();
}

//WRITING PLAYER POSTION TO THE DATABASE
function writePosition1(x,y){  //PLAYER1
database.ref("player1/position").set({
    'x':position1.x+x,
    'y':position1.y+y
})
}
function writePosition2(x,y){  //PLAYER2
database.ref("player2/position").set({
        'x':position2.x+x,
        'y':position2.y+y
})
}

//READING PLAYER POSITION FROM DATABASE
function readPosition1(data){   //PLAYER1
position1 = data.val();
player1.x= position1.x;
player1.y= position1.y;
    
}
function readPosition2(data){   //PLAYER2
    position2 = data.val();
    player2.x= position2.x;
    player2.y= position2.y;
        
    }

//DRAWING LINES IN THE GAME
function drawLine(){
for(var i= 0; i<600;i =i+20){
    stroke("grey");
    line(100,i,100,i+10);
    stroke("yellow")
    line(300,i,300,i+10);
    stroke("red");
    line(500,i,500,i+10);
}

}
//READING GAMESTATE FROM DATABASE
function readGS(data){
    gameState= data.val();
    console.log(gameState)
}

function readScore1(data){
    player1Score = data.val();
}
function readScore2(data){
    player2Score = data.val();
}

function showError(){
    console.log("Error in writing to the database");
}

/*
//PLAYER 2 MOVEMENTS

  if(keyDown("a")){
        writePosition2(-5,0);
    }
    if(keyDown("d")){
        writePosition2(5,0);
    }
    if(keyDown("w")){
        writePosition2(0,-5);
    }
    if(keyDown("s")){
        writePosition2(0,5);
    }
//PLAYER 1 MOVEMENTS
   if(keyDown(LEFT_ARROW)){
            writePosition1(-5,0);
        }
        if(keyDown(RIGHT_ARROW)){
            writePosition1(5,0);
        }
        if(keyDown(UP_ARROW)){
            writePosition1(0,-5);
        }
        if(keyDown(DOWN_ARROW)){
            writePosition1(0,5);
        }


*/