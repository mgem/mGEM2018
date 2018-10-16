//title card
class ghtitle extends Phaser.Scene{
    constructor(){
        super({key:"ghtitle"});
    }
    preload(){
        this.load.image('ghtc','Assembly Title Card.png');
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    }
    create(){
        this.image=this.add.image(window.innerWidth/2,300,'ghtc');
        this.image.setScale(0.45);
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        const clickButton5 = this.add.text(1100, 500, 'Next', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
      //clickButton5.on('pointerdown', () =>{window.location.href = "../fruitninja/index.html"});
      clickButton5.on('pointerdown', () =>{this.scene.start("Assembly_intro");bgmusic.stop()});
      const clickButton6 = this.add.text(200, 500, 'Back', { fontSize: '32px', fill: '#FFFF00' });
      clickButton6.setInteractive();
      clickButton6.on('pointerdown', () =>{this.scene.start("Example2");bgmusic.stop()});

    }
}