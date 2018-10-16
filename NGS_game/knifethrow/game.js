// the game itself
var game;
 
// global game options
var gameOptions = {
 
    // target rotation speed, in degrees per frame
    rotationSpeed: 3,
 
    // knife throwing duration, in milliseconds
    throwSpeed: 150,
 
    // minimum angle between two knives
    minAngle: 15
}
 
// once the window loads...
window.onload = function() {
 
    // game configuration object
    var gameConfig = {
 
        // render type
       type: Phaser.CANVAS,
 
       // game width, in pixels
       width: 1000,//window.innerWidth//originally 750//1000
 
       // game height, in pixels
       height: 1334,//1334,
 
       // game background color
       backgroundColor: 0x444444,
 
       // scenes used by the game
       scene: [playGame]
    };
 
    // game constructor
    game = new Phaser.Game(gameConfig);
 
    // pure javascript to give focus to the page/frame and scale the game
   window.focus()
   resize();
   window.addEventListener("resize", resize, false);
}
 //minescore
 var score = 0;
var scoreText;
var cumultativeScore;
var highscoreText;
var scorecache;

let throwaudio;
let hitaudio;

// PlayGame scene
class playGame extends Phaser.Scene{
 
    // constructor
    constructor(){
        super("PlayGame");
    }
 
    // method to be executed when the scene preloads
    preload(){
 
        // loading assets
        this.load.image("target", "Game 3- Primer Plate.png");
        this.load.image("knife", "ssDNA.png");
       // this.load.audio("bgmusic",'bensound-betterdays.mp3');
        this.load.audio("throwaudio",'413030__soundsforhim__throwing-clothes-on-the-floor-2.mp3')
        this.load.audio("hitaudio",'244257__bajko__slice-apple-on-wood-fizz.mp3')
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    }
 
    // method to be executed once the scene has been created
    create(){
        const clickButton2 = this.add.text(780, 1170, 'Next game', { fontSize: '40px', fill: '#FFFF00' });
      clickButton2.setInteractive();
      clickButton2.on('pointerdown', () => window.location.href = "../fruitninja/index.html" );//CHANGE TO GUITAR HERO
      const clickButton1 = this.add.text(0,1170, 'Home', { fontSize: '40px', fill: '#FFFF00' });
      clickButton1.setInteractive();
      clickButton1.on('pointerdown', () =>{window.location.href = "../preloading/loading.html"});
        
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        throwaudio=this.sound.add('throwaudio');
        hitaudio=this.sound.add("hitaudio");
 
        // can the player throw a knife? Yes, at the beginning of the game
        this.canThrow = true;
 
        // group to store all rotating knives
        this.knifeGroup = this.add.group();
        
        

        // adding the knife
        this.knife = this.add.sprite(game.config.width / 2, game.config.height / 5 * 4.3, "knife");//this.knife = this.add.sprite(game.config.width / 2, game.config.height / 5 * 4.3, "knife");
        this.knife.setScale(0.5);//mine
 
        // adding the target
        this.target = this.add.sprite(game.config.width / 2, 500, "target");//y originally 400
        //this.target = this.add.sprite(game.config.width / 2, 500, "target");//this.target.setScale(0.25)
 
        // moving the target on front
        this.target.depth = 1;
        //minescore
        scoreText = this.add.text(0, 50, 'score: 0', { fontSize: '32px', fill: '#FFFFFF' });//#FF0000
        cumultativeScore=this.add.text(0,90,'cumulative score:0',{ fontSize: '32px', fill: '#FFFFFF' });
        highscoreText=this.add.text(0,130,'high score:0',{ fontSize: '32px', fill: '#FFFFFF' });
        this.add.text(0, 10, "Tip: Don't hit the same one twice", { fontSize: '32px', fill: '#FFFFFF' });
        // waiting for player input to throw a knife
        this.input.on("pointerdown", this.throwKnife, this);
        
    }
 
    // method to throw a knife
    throwKnife(){
 
        // can the player throw?
        if(this.canThrow){
            throwaudio.play();
 
            // player can't throw anymore
            this.canThrow = false;
 
            // tween to throw the knife
            this.tweens.add({
 
                // adding the knife to tween targets
                targets: [this.knife],
 
                // y destination
                y: this.target.y + this.target.width / 2,
 
                // tween duration
                duration: gameOptions.throwSpeed,
 
                // callback scope
                callbackScope: this,
 
                // function to be executed once the tween has been completed
                onComplete: function(tween){
 
                    // at the moment, this is a legal hit
                    var legalHit = true;
 
                    // getting an array with all rotating knives
                    var children = this.knifeGroup.getChildren();
 
                    // looping through rotating knives
                    for (var i = 0; i < children.length; i++){
 
                        // is the knife too close to the i-th knife?
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.target.angle, children[i].impactAngle)) < gameOptions.minAngle){
 
                            // this is not a legal hit
                            legalHit = false;
 
                            // no need to continue with the loop
                            break;
                        }
                    }
 
                    // is this a legal hit?
                    if(legalHit){
 
                        // player can now throw again
                        this.canThrow = true;
 
                        // adding the rotating knife in the same place of the knife just landed on target
                        var knife = this.add.sprite(this.knife.x, this.knife.y, "knife");
                        knife.setScale(0.5);//mine
 
                        // impactAngle property saves the target angle when the knife hits the target
                        knife.impactAngle = this.target.angle;
 
                        // adding the rotating knife to knifeGroup group
                        this.knifeGroup.add(knife);
 
                        // bringing back the knife to its starting position
                        this.knife.y = game.config.height / 5 * 4.3;//game.config.height / 5 * 4
                        //minescore
                        score++;
                        scoreText.setText('Score: ' + score);
                        
                        scorecache=score;localStorage.setItem("scorecachekt",scorecache);
                        
                        var highscorekt=Math.max(score, localStorage.getItem("highscorekt"));
                        localStorage.setItem("highscorekt", highscorekt);
                        //var highscorektnum=parseInt(highscorekt,10) ||0;
                        highscoreText.setText('High Score:'+highscorekt);

                        //var highscorefn=localStorage.getItem("highscore");
                        //var highscorefnnum=parseInt(highscorefn,10) ||0;

                        var scorecachefn=parseInt(localStorage.getItem("scorecachefn"),10)||0;
                        
                        //var cumscore = highscorektnum+highscorefnnum;
                        var cumscore = scorecache+scorecachefn;
                        cumultativeScore.setText('Cumulative Score:'+ cumscore);
                        
        
                    }
 
                    // in case this is not a legal hit
                    else{
                        hitaudio.play();
 
                        // tween to throw the knife
                        this.tweens.add({
 
                            // adding the knife to tween targets
                            targets: [this.knife],
 
                            // y destination
                            y: game.config.height + this.knife.height,
 
                            // rotation destination, in radians
                            rotation: 5,
 
                            // tween duration
                            duration: gameOptions.throwSpeed * 4,
 
                            // callback scope
                            callbackScope: this,
                            
 
                            // function to be executed once the tween has been completed
                            onComplete: function(tween){
 
                                // restart the game
                                this.scene.start("PlayGame")
                                //minescore
                                score=0
                            }
                        });
                    }
                }
            });
        }
    }
 
    // method to be executed at each frame
    update(){
       
 
        // rotating the target
        this.target.angle += gameOptions.rotationSpeed;
 
        // getting an array with all rotating knives
        var children = this.knifeGroup.getChildren();
 
        // looping through rotating knives
        for (var i = 0; i < children.length; i++){
 
            // rotating the knife
            children[i].angle += gameOptions.rotationSpeed;
 
            // turning knife angle in radians
            var radians = Phaser.Math.DegToRad(children[i].angle + 90);
 
            // trigonometry to make the knife rotate around target center
            children[i].x = this.target.x + (this.target.width / 2) * Math.cos(radians);
            children[i].y = this.target.y + (this.target.width / 2) * Math.sin(radians);
            
            
        }
       
 
    }
}
 
// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
