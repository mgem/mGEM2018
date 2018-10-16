//title card
class kttitle extends Phaser.Scene{
    constructor(){
        super({key:"kttitle"});
    }
    preload(){
        this.load.image('kttc','Bridge Amplification Title Card.png');
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    }
    create(){
        this.image=this.add.image(window.innerWidth/2,300,'kttc');
        this.image.setScale(0.35);
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        const clickButton5 = this.add.text(1100, 500, 'Next', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
     // clickButton5.on('pointerdown', () =>{window.location.href = "../knifethrow/index.html"});
     clickButton5.on('pointerdown', () =>{this.scene.start("BridgeAmplification_intro");bgmusic.stop()});
      const clickButton6 = this.add.text(200, 500, 'Back', { fontSize: '32px', fill: '#FFFF00' });
      clickButton6.setInteractive();
      clickButton6.on('pointerdown', () =>{this.scene.start("Example2");bgmusic.stop()});

    }
}