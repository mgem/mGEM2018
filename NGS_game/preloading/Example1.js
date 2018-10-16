class Example1 extends Phaser.Scene{
constructor(){
    super({key:"Example1"});
}
preload(){
    this.load.image('logo','Introduction Loading GIF.gif');
    this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    
}
create(){
    let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
    
        
    this.image=this.add.image(window.innerWidth/2,300,'logo');
    this.image.setScale(0.45);
    const clickButton5 = this.add.text(1050, 550, 'Next', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
      clickButton5.on('pointerdown', () =>{this.scene.start("Example2");bgmusic.stop()});

    /*const clickButton1 = this.add.text(400, 500, 'Credits', { fontSize: '32px', fill: '#FFFF00' });
      clickButton1.setInteractive();
      clickButton1.on('pointerdown', () =>{this.scene.start("Example2")});
      const clickButton2 = this.add.text(550, 500, 'Game 1', { fontSize: '32px', fill: '#FFFF00' });
      clickButton2.setInteractive();
      clickButton2.on('pointerdown', () => window.location.href = "../knifethrow/index.html" );
      const clickButton3 = this.add.text(700, 500, 'Game 2', { fontSize: '32px', fill: '#FFFF00' });
      clickButton3.setInteractive();
      clickButton3.on('pointerdown', () => window.location.href = "../fruitninja/index.html" );
      const clickButton4 = this.add.text(850, 500, 'Game 3', { fontSize: '32px', fill: '#FFFF00' });
      clickButton4.setInteractive();
      //clickButton4.on('pointerdown', () => window.location.href = "../fruitninja/index.html" );
      */
    
    
}
}
