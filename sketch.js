
var monkey , monkey_running
var banana ,bananaImage, obstacle,trap1,trap2,trap3 ,bomb1,bomb2,invisibleGround;
var FoodGroup, obstacleGroup
var survivalTime,gameOver,gameOverImg,restart,restartImg,backGround,backGroundImg,jumpSound,gameOverSnd,gameBeginImg,gameBegin,HI,scaleI;

var vInc;

var gameState="serve";

function preload()
{
  
monkey_running= loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  bananaImage = loadImage("banana.png");         
  trap1       = loadImage("animalTrap.png");
  trap2       = loadImage("metalTrap.png");
  trap3       = loadImage("trapRust.png");
  gameOverImg = loadImage("GAME OVER.png")
  restartImg  = loadImage("restart.png");
  backGround  = loadImage("jungle.jpg");
  gameBeginImg= loadImage("gameBegin.png");
  bomb1       = loadImage("Dynamite.png");
  bomb2       = loadImage("bomb.png");

  jumpSound   = loadSound("jumpSound.mp3");
  gameOverSnd = loadSound("mixkit-melodic-game-over-956.wav");
}

function setup() 
{
  //creating the play area 
  createCanvas(windowWidth,windowHeight);
  
  //CREATING INVISIBLE GROUND
  invisibleGround = createSprite(300,height-50,600,20);
  invisibleGround.visible=false;
  
  //the initial scale
  scaleI=0.07;
  
  //creating the second ground 
  ground2 = createSprite(width/2,height*0.1,20,20)
  ground2.addImage(backGround);
  ground2.scale=2.5;
  
  //creating the ground
  ground = createSprite(width/2,height*0.1,20,20);
  ground.scale=2.5;
  ground.addImage(backGround); 
  
  //creating game Begin page 
  gameBegin=createSprite(width/2,height/2,20,20);
  gameBegin.addImage(gameBeginImg);
  gameBegin.visible=false;
  
  //creating the monkey
  monkey = createSprite(300,height-63,20,20);
  monkey.addAnimation("running",monkey_running);
  monkey.scale=scaleI;
  monkey.setCollider("rectangle",0,0,400,500);

  //creating the game Over sprite
  gameOver = createSprite(width/2,height/2,20,20);
  gameOver.addImage(gameOverImg);
  gameOver.visible=false;
  
  //creating the restart sprite
  restart = createSprite(width/2,height*0.8,20,20);
  restart.addImage(restartImg);
  restart.scale=0.5;
  restart.visible=false;
  
  //HIGH SCORE=0
  HI=0;
  
  //assigning groups
  FoodGroup     = new Group();
  obstacleGroup = new Group();
  
  //survivalTime is 0 at the beginning
  survivalTime = 0;
}


function draw() 
{
  
  if(gameState==="serve")
  {
    drawSprites();
    monkey.visible=false;
    gameBegin.visible=true;
    gameBegin.scale=0.1;
    
                  if(touches.length>0||mousePressedOver(gameBegin))
    {
      gameState="play";
      monkey.visible=true;
    }
  }
  
  if(gameState==="play")
  {
    background("");  
    vInc=floor(survivalTime/20);
    gameBegin.visible=false;
   
    ground.velocityX=-(6+vInc);
    spawnBananas();
    spawnObstacles(); 
    
    if(survivalTime>HI)
    {
      HI=survivalTime;
    }
  if((touches.length>0||keyDown("space"))&&monkey.y>(height-150))
   {
     jumpSound.play();
     monkey.velocityY=-20;
     touches=[];
   }

   monkey.velocityY=monkey.velocityY+0.8;
        
   if(ground.x<0)
   {
     ground.x=width*0.35;
   }
        
   if(monkey.isTouching(FoodGroup))
   {
     FoodGroup.destroyEach();
     survivalTime=survivalTime+5;
     scaleI=scaleI*1.2; 
   }
   
   monkey.scale=scaleI;
    
   if(monkey.isTouching(obstacleGroup))
   {
     gameState="end";
     gameOverSnd.play(); 
   }
   drawSprites();  
  }
  
  if(gameState==="end")
  {
    ground.x=300;
    ground.velocityX=0;
    monkey.velocityY=0;
    monkey.velocityX=0;
    monkey.y=337;      
    background("yellow");
    monkey.visible=false;
    gameOver.visible=true;
    restart.visible=true;
    gameBegin.visible=false;
    FoodGroup.setVelocityEach(0);
    obstacleGroup.setVelocityEach(0);
    
    drawSprites();
    if(touches.length>0||mousePressedOver(restart))
    {
      reset();
      touches=[];
    }
  }

  monkey.collide(invisibleGround);
  textSize(20);
  fill("");
  text("score=" + survivalTime,width*0.54,height*0.1);
  text("high score=" + HI,width*0.54-150,height*0.1);
}

function spawnBananas()
{
  var bananaY = Math.round(random(70,width-150));
  if(frameCount%80==0)
  {  
    banana = createSprite(600,bananaY,30,30);
    banana.addImage(bananaImage);
    banana.scale=0.08;
    banana.velocityX=-(10+vInc);
    FoodGroup.add(banana);
    banana.lifetime=100;
  }
}
 
function spawnObstacles()
{
  var randomY = Math.round(random(height-93,height-33));
  if(frameCount%100==0)
  {
    obstacle=createSprite(600,randomY,200,200);
    obstacle.velocityX=-(6+vInc);
    obstacle.setCollider("circle",0,0,500);
    switch(Math.round(random(1,5)))
      {
        case 1:obstacle.addImage(trap1);
               break;
               
        case 2:obstacle.addImage(trap2);
               break;
               
        case 3:obstacle.addImage(trap3);
               break;
      
        case 4:obstacle.addImage(bomb1);
               obstacle.scale=0.5;
               obstacle.setCollider("rectangle",0,0,350,850)
               break;
               
        case 5:obstacle.addImage(bomb2);
               obstacle.scale=5;
               break;
      }
    obstacle.scale=0.08;
    obstacleGroup.add(obstacle);
    obstacle.lifetime=100;
  }
}
function reset()
{
  survivalTime=0;
  monkey.visible=true;
  gameOver.visible=false;
  restart.visible=false;
  gameState="play";
  FoodGroup.destroyEach();
  obstacleGroup.destroyEach();
  scaleI=0.07
}

