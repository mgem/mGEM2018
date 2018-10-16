const w = window.innerWidth;
const h = window.innerHeight;

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
    scene:
      [Example1,Example2,Example3,kttitle,fntitle,ghtitle,Fragmentation_intro,BridgeAmplification_intro,Assembly_intro],
    
  };
  var game = new Phaser.Game(config);
  