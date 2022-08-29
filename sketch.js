var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");


  gameOverImg=loadImage("gameOver.png")
  restartImg=loadImage("restart.png")

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  

  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver=createSprite(width/2,height/2-50)
  gameOver.addImage(gameOverImg)
  gameOver.scale=0.75
  gameOver.visible=false

  restart=createSprite(width/2,height/2)
  restart.addImage(restartImg)
  restart.scale=0.5
  restart.visible=false

  invisibleGround = createSprite(width/2, height-10, width, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //console.log("Hello" + 5);


  //sprite.setCollider("shape",xoffest,yoffset,radius/width ,height)
  trex.setCollider("circle", 0, 0, 40);
  //trex.debug = true

  score = 0
}

function draw() {
  background(180);
  //displaying score
  text("Score: " + score, 500, 50);

  //console.log("this is ", gameState)
  //console.log(trex.y)

  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if ((keyDown("space") || touches.length > 0) && trex.y >= height-80) {
      trex.velocityY = -13;

      touches=[]
    }
    

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;     
    //change the trex animation
    trex.changeAnimation("collided", trex_collided)

//set the lifetime of the game object so that they are never destroyed
obstaclesGroup.setLifetimeEach(-1)
cloudsGroup.setLifetimeEach(-1)


    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameOver.visible=true
    
    restart.visible=true
    
if(mousePressedOver(restart)){
  reset()
}



  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}


function reset(){
  gameState=PLAY
  gameOver.visible=false
  restart.visible=false

  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()

  trex.changeAnimation("running", trex_running);

  score=0

}



function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height-35);
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/6;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, height/2);
    cloud.y = Math.round(random(height/2, (height/2 + height/4)));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = width/3;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}

