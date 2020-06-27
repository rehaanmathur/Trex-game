var trex, trexrunning,trexcollided;
var ground,groundimage,invisibleground;
var cloudimage,obs1,obs2,obs3,obs4,obs5,obs6,cloudsgroup,obstaclesgroup;
var count = 0;
var play = 1;
var end = 0;
var gamestate = play;
var gameover,restart,gameoverimage,restartimage;
var highscore = 0;
var jump,die,checkpoint;
function preload() {
  trexrunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundimage = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
    obs2 = loadImage("obstacle2.png")
  obs3 = loadImage("obstacle3.png")
  obs4 = loadImage("obstacle4.png")
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  trexcollided = loadImage("trex_collided.png")
  gameoverimage = loadImage("gameOver.png")
  restartimage = loadImage ("restart.png");
  jump = loadSound ("jump.mp3")
  die = loadSound("die.mp3")
  checkpoint = loadSound("checkPoint.mp3")
  
}


function setup() {
  createCanvas(600, 200);
  trex = createSprite(50,180,15,20);
  trex.addAnimation("trexrunning",trexrunning);
  trex.addAnimation("collided",trexcollided);
  trex.scale = 0.5;
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundimage);
  ground.x = ground.width/2;
  invisibleground = createSprite(300,185,600,5);
  invisibleground.visible = false;
  obstaclesgroup = new Group();
  cloudsgroup = new Group();
  gameover = createSprite(300,100);
  gameover.addImage(gameoverimage);
  restart = createSprite(300,140)
  restart.addImage(restartimage);
  restart.scale = 0.5;
  gameover.scale = 0.5;
  restart.visible = false;
  gameover.visible = false;
}

function draw() {
  background(180);
  text("score:"+count,500,40);
  text("highscore:"+highscore,400,40);
  if(gamestate == play){
     ground.velocityX = -6;
  count = count + Math.round(getFrameRate()/60);
    if(count>0 && count%100 == 0) {
      checkpoint.play();
    }
  if(ground.x<0){
    ground.x = ground.width/2;
  }
    if(keyDown("space") && trex.y >=159){
    trex.velocityY = -10;
      jump.play();
     }  
  trex.velocityY = trex.velocityY + 0.5;
  SpawnClouds();
  spawnObstacles();
    if(obstaclesgroup.isTouching(trex)){
      gamestate = end;
      die.play();
      //gameOver.visible = true;
     // restart.visible = true;
    }
  }
  else if(gamestate== end){
  ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesgroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    
    
    //change the trex animation
    trex.changeAnimation("collided",trexcollided);
    
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesgroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);  
    gameover.visible = true;
    restart.visible = true;
  }
  
  
 if(mousePressedOver(restart)) {
    reset();
  }
  
 
  trex.collide(invisibleground);
  
  drawSprites();
}

function SpawnClouds(){
   if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(70,120);
    cloud.addImage(cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsgroup.add(cloud)
  }
  
}
function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obs tacles
  var rand =   Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obs1);
        break 
      case 2: obstacle.addImage(obs2);
        break
      case 3: obstacle.addImage(obs3);
        break
       case 4: obstacle.addImage(obs4);
        break
       case 5: obstacle.addImage(obs5);
        break
       case 6: obstacle.addImage(obs6);
        break
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    obstaclesgroup.add(obstacle);
  }
}
  function reset () {
   gamestate= play;
  gameover.visible= false;
  restart.visible = false;
 obstaclesgroup.destroyEach();
  cloudsgroup.destroyEach();
  trex.changeAnimation("trexrunning",trexrunning);
    if(highscore<count){
      highscore = count;
    }
  count = 0;
}



