

      const w = window.innerWidth;
      const h = window.innerHeight;
      // The game will be configured with these settings:
     
      const config = {
        type: Phaser.AUTO,
        width: w,
        height: h,
        backgroundColor: 0x444444,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: h / 3 },
            debug: false
          }
        },
        scene: {
          preload,
          create,
          update
        },
        parent: "phaser-container"
      };
      
  
      var game = new Phaser.Game(config);
    
  
      // game state details (loading, scoring, etc.)
      let gameStarted = false;
      const LOAD_TIME = 5000;
      let loaded = false;
      let score = 0;
      const INIT_LIVES = 3;
      let lives = INIT_LIVES;
      let loadingLabel, scoreLabel, livesLabel;
      const SCORE_LOCATION = { x: 10, y: 10 };
      const LIVES_LOCATION = { x: 10, y: 30 };
      const LOADING_LOCATION = { x: 100, y: 70 };
      const LABEL_FILL = "white";
      var cumultativeScore;
      var scorecache;
  
      // lines drawn by mouse/touch
      let s;
      let lines = [];
      const LINE_DURATION = 100;
      const COLOR = 0xffff00;
      const THICKNESS = 2;
      const ALPHA = 1;
  
      // good and bad objects (i.e. fruits and bombs)
      const INIT_NUM_GOOD = 3;
      const INIT_NUM_BAD = 2;
      const MAX_NUM_OBJECTS = 10;
      let goodObjects, badObjects, goodParts, badParts;
      const SPAWN_RATE = 0.005;
      let enoughObjects = false;
      const FIRE_RATE = 1000;
      
  
      let graphics;
      let time;
      let physics;

      let slicing;
      let wrong;
  
      // preload images
      function preload() {
        this.load.image("goodObject", 'assets/Game 1- DNA.png');
        this.load.image("badObject", 'assets/Game 1- Bomb DNA.png');
        this.load.image("goodPart",'assets/Game 1- Fragmented DNA.png');
        this.load.image("badPart", 'assets/Game 1- Fragmented Bomb DNA.png');
        this.load.audio("bgmusic",'assets/bensound-betterdays.mp3');
        this.load.audio("slicing",'assets/244257__bajko__slice-apple-on-wood-fizz.mp3');
        this.load.audio('wrong','assets/242503__gabrielaraujo__failure-wrong-action.wav');
      }
  
      // initialize the game's components
      function create() {
        const clickButton2 = this.add.text(10, 100, 'Next game', { fontSize: '16px', fill: '#FFFF00' });
      clickButton2.setInteractive();
      clickButton2.on('pointerdown', () => window.location.href = "../knifethrow/index.html" );
      
      const clickButton1 = this.add.text(10,120, 'Home', { fontSize: '16px', fill: '#FFFF00' });
      clickButton1.setInteractive();
      clickButton1.on('pointerdown', () =>{window.location.href = "../preloading/loading.html"});
      //aug29
      cumultativeScore=this.add.text(10,50,'cumulative score:0',{ fontSize: '16px', fill: '#FFFFFF' });

        graphics = this.add.graphics();
        time = this.time;
        physics = this.physics;
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        slicing=this.sound.add('slicing');
        wrong=this.sound.add('wrong');
  
        // since JavaScript is dynamically typed,
        // we should populate our arrays to save time
        for (let i = 0; i < 10; i++) {
          lines.push(
            new Phaser.Geom.Line(
              LOADING_LOCATION.x,
              LOADING_LOCATION.y,
              LOADING_LOCATION.x,
              LOADING_LOCATION.y
            )
          );
        }
        goodObjects = physics.add.group({
          key: "goodObject",
          repeat: INIT_NUM_GOOD - 1,
          setXY: { x: startX(), y: startY() }
        });
        Phaser.Actions.ScaleXY(goodObjects.getChildren(), -0.5, -0.5);
        badObjects = physics.add.group({
          key: "badObject",
          repeat: INIT_NUM_BAD - 1,
          setXY: { x: startX(), y: startY() }
        });
        Phaser.Actions.ScaleXY(badObjects.getChildren(), -0.5, -0.5);
        goodParts = physics.add.group();
        badParts = physics.add.group();
  
        // launch all the objects (they bounce while the game loads)
        goodObjects.children.iterate(function(goodObject) {
          launchObject(goodObject);
          goodObject.setActive(false);
          goodObject.setScale(0.5);//mine
        });
        badObjects.children.iterate(function(badObject) {
          launchObject(badObject);
          badObject.setActive(false);
          badObject.setScale(0.5);//mine
        });
  
        let leftButtonDown = false;
  
        // when screen is touched/clicked
        this.input.on("pointerdown", function(pointer) {
          if (pointer.leftButtonDown()) {
            leftButtonDown = true;
            s = {
              x: pointer.x,
              y: pointer.y
            };
  
            // on the first click after the game has loaded,
            // relaunch the objects and clear any old lines
            if (!gameStarted && loaded) {
              loadingLabel.setText("");
              gameStarted = true;
              goodObjects.children.iterate(function(goodObject) {
                launchObject(goodObject);
                goodObject.setScale(0.5);//mine
              });
              badObjects.children.iterate(function(badObject) {
                launchObject(badObject);
                badObject.setScale(0.5);//mine
              });
              time.addEvent({
                delay: LINE_DURATION, // TODO: shorter delay on faster devices
                callback: () => {
                  lines = [];
                }
              });
            }
          }
        });
  
        this.input.on("pointerup", function() {
          leftButtonDown = false;
          if (gameStarted) {
            lines = [];
          }
        });
  
        this.input.on("pointermove", function(pointer) {
          if (gameStarted && leftButtonDown) {
            // sx and sy from source point or from end of last line
            let sx = s.x;
            let sy = s.y;
            const len = lines.length;
            if (len) {
              const last = lines[len - 1];
              sx = last.x2;
              sy = last.y2;
            }
  
            // add new line from last point to current point
            const line = new Phaser.Geom.Line(sx, sy, pointer.x, pointer.y);
            lines.push(line);
  
            // remove old lines after a given amount of time
            time.addEvent({
              delay: LINE_DURATION,
              callback: () => {
                if (lines.length && Phaser.Geom.Line.Equals(lines[0], line)) {
                  lines.shift();
                }
              }
            });
          }
  
          s = {
            x: pointer.x,
            y: pointer.y
          };
  
          // before game starts, the initial array of lines should be kept up-to-date
          if (!gameStarted) {
            lines.push(new Phaser.Geom.Line(s.x, s.y, s.x, s.y));
            lines.shift();
          }
        });
  
        scoreLabel = this.add.text(
          SCORE_LOCATION.x,
          SCORE_LOCATION.y,
          "Tip: Get the green ones!"
        );
        scoreLabel.setFill(LABEL_FILL);
  
        livesLabel = this.add.text(
          LIVES_LOCATION.x,
          LIVES_LOCATION.y,
          `Lives remaining: ${lives}`
        );
        livesLabel.setFill(LABEL_FILL);
  
        loadingLabel = this.add.text(
          LOADING_LOCATION.x,
          LOADING_LOCATION.y,
          "Loading..."
        );
        loadingLabel.setFill(LABEL_FILL);
  
        // give the physics engine some time to warm up
        time.addEvent({
          delay: LOAD_TIME,
          callback: () => {
            loaded = true;
            loadingLabel.setText("Click HERE to start!");
          }
        });
        this.key_2=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
      }
  
      // launch object upwards from bottom of screen towards middle
      function launchObject(obj) {
        if (obj && obj.body) {
          obj.body.reset(startX(), startY());
          const velX = (w / 2 - obj.body.center.x) * 0.5 * Math.random();
          obj.setVelocityX(velX);
          obj.setAngularVelocity(velX * 2);
          obj.setVelocityY(Math.random() * -(0.1 * h) - 0.7 * h);
          obj.setActive(true);
        }
      }
  
      // when a line intersects a good object:
      // show object parts,
      // reset and relaunch the object,
      // increase the score
      function intersectGoodObject(line, goodObject) {
      
        goodObject.setActive(false);
        addGoodParts(goodObject, Math.floor(Math.random() * 2) + 2); // 2 to 4
        slicing.play();
        goodObject.body.reset(startX(), startY());
        time.addEvent({
          delay: FIRE_RATE,
          callback: () => launchObject(goodObject)
        });
        score++;
        scoreLabel.setText(`Score: ${score}`);

        scorecache=score;localStorage.setItem("scorecachefn",scorecache);
        
                        
                        var highscorekt=Math.max(score, localStorage.getItem("highscorekt"));
                        //localStorage.setItem("highscorekt", highscorekt);
                        var highscorektnum=parseInt(highscorekt,10) ||0;

                        var highscorefn=localStorage.getItem("highscore");
                        var highscorefnnum=parseInt(highscorefn,10) ||0;
                        
                        var scorecachekt=parseInt(localStorage.getItem("scorecachekt"),10)||0;
                        //var cumscore = highscorektnum+highscorefnnum;
                        var cumscore = scorecache+scorecachekt;
                        cumultativeScore.setText('Cumulative Score:'+ cumscore);
        
        
      }
  
      // when a line intersects a bad object:
      // show object parts,
      // reset and relaunch the object,
      // decrease the lives
      function intersectBadObject(line, badObject) {
        badObject.setActive(false);
        addBadParts(badObject, Math.floor(Math.random() * 4) + 6); // 6 to 10;
        wrong.play();
        badObject.body.reset(startX(), startY());
        time.addEvent({
          delay: FIRE_RATE,
          callback: () => launchObject(badObject)
        });
        loseLives(INIT_LIVES);

        var highscorekt=Math.max(score, localStorage.getItem("highscorekt"));
                        //localStorage.setItem("highscorekt", highscorekt);
                        var highscorektnum=parseInt(highscorekt,10) ||0;

                        var highscorefn=localStorage.getItem("highscore");
                        var highscorefnnum=parseInt(highscorefn,10) ||0;
                        
                        var cumscore = highscorektnum+highscorefnnum;
                        cumultativeScore.setText('Cumulative Score:'+ cumscore);
      }
  
      // generate a pseudorandom x-coordinate
      function startX() {
        return Math.random() * 0.75 * w + 0.1 * w;
      }
  
      // generate a starting y-coordinate
      function startY() {
        return h + 100;
      }
  
      // add a brand-new good object
      function addGoodObject() {
        const goodObject = goodObjects.create(startX(), startY(), "goodObject");
        launchObject(goodObject);
        goodObject.setScale(0.5);//mine
      }
      // add a brand-new good object
      function addBadObject() {
        const badObject = badObjects.create(startX(), startY(), "badObject");
        launchObject(badObject);
        badObject.setScale(0.5);//mine
      }
  
      // given a bad object and the number of parts to add,
      // add these bad parts
      function addBadParts(badObject, numParts) {
        if (badObject && badObject.body) {
          const x = badObject.body.x;
          const y = badObject.body.y;
          for (let i = 0; i < numParts; i++) {
            const velX = Math.random() * 400 - 200;
            const velY = Math.random() * 400 - 200;
            const badPart = badParts.create(x, y, "badPart");
            badPart.setVelocityX(velX);
            badPart.setVelocityY(velY);
            badPart.setAngularVelocity(velX * 2);
            badPart.setScale(0.25);//mine
            badPart.setAlpha(0.3);

            // destroy this part once it's unneeded
            time.addEvent({
              delay: LOAD_TIME,
              callback: () => badPart.destroy()
            });
          }
        }
      }
  
      // given a good object and the number of parts to add,
      // add these good parts
      function addGoodParts(goodObject, numParts) {
        if (goodObject && goodObject.body) {
          const x = goodObject.body.x;
          const y = goodObject.body.y;
          for (let i = 0; i < numParts; i++) {
            const velX = Math.random() * 40 - 20;
            const velY = Math.random() * 40 - 20;
            const goodPart = goodParts.create(x + velX, y + velY, "goodPart");
            goodPart.setVelocityX(velX);
            goodPart.setVelocityY(velY);
            goodPart.setAngularVelocity(velX * 2);
            goodPart.setScale(0.25);//mine
            goodPart.setAlpha(0.3);
  
            // destroy this part once it's unneeded
            time.addEvent({
              delay: LOAD_TIME,
              callback: () => goodPart.destroy()
            });
          }
        }
      }
  
      // decrement lives by the number numLost,
      // reset the game once player runs out of lives
      function loseLives(numLost) {
        lives = Math.max(lives - numLost, 0);
        livesLabel.setText(`Lives remaining: ${lives}`);
        if (lives === 0) {
          resetGame();
        }
      }
  
      // update the game's state if the game started,
      // otherwise just let objects bounce in background
      function update() {
        if (gameStarted) {
          
          updateGame();
        } else {
          
          bounceObjects();
        }
      }
  
      // relaunch the objects if they fall too far (i.e. bounce them)
      function bounceObjects() {
        goodObjects.children.iterate(function(goodObject) {
          if (goodObject && goodObject.body.center.y > h + 100) {
            goodObject.setActive(false);
            launchObject(goodObject);
            goodObject.setScale(0.5);//mine
          }
        });
  
        badObjects.children.iterate(function(badObject) {
          if (badObject && badObject.body.center.y > h + 100) {
            badObject.setActive(false);
            launchObject(badObject);
            badObject.setScale(0.5);//mine
          }
        });
      }
  
      // update the actual game components
      function updateGame() {
        // occasionally spawn new objects
        if (!enoughObjects) {
          enoughObjects =
            goodObjects.countActive() + badObjects.countActive() >
            MAX_NUM_OBJECTS;
          if (Math.random() < SPAWN_RATE) {
            if (Math.random() < 0.75) {
              addBadObject();
            } else {
              addGoodObject();
            }
          }
        }
  
        goodObjects.children.iterate(function(goodObject) {
          // handle intersections of lines and good objects
          if (goodObject && goodObject.active) {
            for (const line of lines) {
              if (Phaser.Geom.Intersects.LineToRectangle(line, goodObject.body)) {
                intersectGoodObject(line, goodObject);
                break;
              }
            }
          }
  
          // handle bouncing of good objects
          if (
            goodObject &&
            goodObject.active &&
            goodObject.body.center.y > h + 100
          ) {
            loseLives(1);
            goodObject.setActive(false);
            time.addEvent({
              delay: FIRE_RATE,
              callback: () => launchObject(goodObject)
            });
          }
        });
  
        badObjects.children.iterate(function(badObject) {
          // handle intersections of lines and bad objects
          if (badObject && badObject.active) {
            for (const line of lines) {
              if (Phaser.Geom.Intersects.LineToRectangle(line, badObject.body)) {
                intersectBadObject(line, badObject);
                break;
              }
            }
          }
  
          // handle bouncing of bad objects
          if (
            badObject &&
            badObject.active &&
            badObject.body.center.y > h + 100
          ) {
            badObject.setActive(false);
            time.addEvent({
              delay: FIRE_RATE,
              callback: () => launchObject(badObject)
            });
          }
        });
  
        // draw lines
        graphics.clear();
        graphics.lineStyle(THICKNESS, COLOR, ALPHA);
        for (const line of lines) {
          graphics.strokeLineShape(line);
        }
      }
  
      // reset the game state when the player loses
      function resetGame() {
        var highscore = Math.max(score, localStorage.getItem("highscore"));
        localStorage.setItem("highscore", highscore);
        goodObjects.clear(true, true);
        badObjects.clear(true, true);
        enoughObjects = true;
        scoreLabel.setText(`High Score: ${highscore}`);
        loadingLabel.setText(`Game Over! Score: ${score}`);
        score = 0;
        
        
  
        // after user has absorbed the 'game over' screen,
        // restart the game
        time.addEvent({
          delay: FIRE_RATE * 2,
          callback: () => {
            lives = INIT_LIVES;
            livesLabel.setText(`Lives remaining: ${lives}`);
            for (let i = 0; i < INIT_NUM_GOOD; i++) {
              addGoodObject();
            }
            for (let i = 0; i < INIT_NUM_BAD; i++) {
              addBadObject();
            }
            enoughObjects = false;
            loadingLabel.setText("");
          }
        });
      }
    