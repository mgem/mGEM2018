class Example3 extends Phaser.Scene{
    constructor(){
        super({key:"Example3"});
    }
    preload(){
        this.load.image('credits','credits.png');
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    }
    create(){
        this.add.image(window.innerWidth/2,300,'credits');
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        const clickButton5 = this.add.text(window.innerWidth/2, 500, 'Back', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
      clickButton5.on('pointerdown', () =>{this.scene.start("Example1");bgmusic.stop()});
    }
}