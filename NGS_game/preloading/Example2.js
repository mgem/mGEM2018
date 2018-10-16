class Example2 extends Phaser.Scene{
    constructor(){
        super({key:"Example2"});
    }
    preload(){
        //this.load.image('credits','credits.png');
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
        //this.load.image("border",'border.jpeg');
    }
    create(){
        //this.add.image(window.innerWidth/2,300,'credits');
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();

        //let border=this.add.image(700,310,'border');
        //border.setScale(0.5,1.5);
        
        const clickButton5 = this.add.text(550, 500, 'Back', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
      clickButton5.on('pointerdown', () =>{this.scene.start("Example1");bgmusic.stop()});
      
      const clickButton1 = this.add.text(550, 100, 'Credits', { fontSize: '32px', fill: '#FFFF00' });
      clickButton1.setInteractive();
      clickButton1.on('pointerdown', () =>{this.scene.start("Example3");bgmusic.stop()});

      const clickButton2 = this.add.text(550, 200, 'Fragmentation', { fontSize: '32px', fill: '#FFFF00' });
      clickButton2.setInteractive();
      //clickButton2.on('pointerdown', () => window.location.href = "../knifethrow/index.html" );
      clickButton2.on('pointerdown', () => {this.scene.start("fntitle") ;bgmusic.stop()});
      const clickButton3 = this.add.text(550, 300, 'Bridge Amplification', { fontSize: '32px', fill: '#FFFF00' });
      clickButton3.setInteractive();
      clickButton3.on('pointerdown', () =>{ this.scene.start("kttitle");bgmusic.stop()} );
      const clickButton4 = this.add.text(550, 400, 'Assembly', { fontSize: '32px', fill: '#FFFF00' });
      clickButton4.setInteractive();
      clickButton4.on('pointerdown', () => {this.scene.start("ghtitle") ;bgmusic.stop()});
    }
    
    
  
}
