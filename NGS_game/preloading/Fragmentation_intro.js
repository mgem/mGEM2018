class Fragmentation_intro extends Phaser.Scene{
    constructor(){
        super({key:"Fragmentation_intro"});
    }
    preload(){
        this.load.image('Frag_intro','Library Preparation Loading GIF.gif');
        this.load.audio("bgmusic",'../fruitninja/assets/bensound-betterdays.mp3');
    }
    create(){
        this.image=this.add.image(window.innerWidth/2,300,'Frag_intro');
       this.image.setScale(0.45);
        let bgmusic=this.sound.add('bgmusic');
        bgmusic.play();
        const clickButton4 = this.add.text(window.innerWidth/2-400, 550, 'Back', { fontSize: '32px', fill: '#FFFF00' });
      clickButton4.setInteractive();
      clickButton4.on('pointerdown', () =>{this.scene.start("fntitle");bgmusic.stop()});
        const clickButton5 = this.add.text(window.innerWidth/2+350, 550, 'Next', { fontSize: '32px', fill: '#FFFF00' });
      clickButton5.setInteractive();
      clickButton5.on('pointerdown', () =>{window.location.href = "../fruitninja/index.html"});
    }
}