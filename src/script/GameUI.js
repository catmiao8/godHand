import StartUI from "./StartUI"
import GameControl from "./GameControl"

export default class GameUI extends Laya.Scene{
  constructor() {
    super();
    //设置单例的引用方式，方便其他类引用
    GameUI.instance = this;
    this.firstTime = true;
    //加载场景文件
    this.loadScene("scene/gameScene.scene");
    this.color = new Laya.ColorFilter(Laya.ColorFilter.GRAY_MATRIX);
  }

  onEnable() {
    this._control = this.getComponent(GameControl);
    this._control.setCreateStoneInterval(StartUI.instance.createInterval);
    this.maskOrder.on(Laya.Event.CLICK, this, ()=>{
      this.startGame();
    });

    //左边区域添加事件
    this.leftBox.on(Laya.Event.MOUSE_DOWN, this, ()=>{
      this.leftHand.filters = [this.color];
      this.leftSprite.x = 150;
    });

    this.leftBox.on(Laya.Event.MOUSE_UP, this, ()=>{
      this.leftHand.filters = null;
      this.leftSprite.x = 280;
    });

    //右边区域添加事件
    this.rightBox.on(Laya.Event.MOUSE_DOWN, this, ()=>{
      this.rightHand.filters = [this.color];
      this.rightSprite.x = 554;
    });

    this.rightBox.on(Laya.Event.MOUSE_UP, this, ()=>{
      this.rightHand.filters = null;
      this.rightSprite.x = 424;
    });

    this.backBtn.on(Laya.Event.CLICK, this, ()=>{
      Laya.SoundManager.playSound("sound/click.mp3", 1);
      this._control.removeScoreText();
      Laya.Scene.open("scene/startScene.scene");
    });

    this.shareBtn.on(Laya.Event.CLICK, this, ()=>{
      Laya.SoundManager.playSound("sound/click.mp3", 1);
      this.shareBtn.visible = false;
      this.createShareView(this._control._score);
      setTimeout(()=>{
        this.continueBtn.visible = true;
      }, 1500);
    });

    this.continueBtn.on(Laya.Event.CLICK, this, ()=>{
      Laya.SoundManager.playMusic("sound/bgmusic.mp3", 0);
      this.setVisble([this.continueBtn, false, this.backBtn, false, this.leftBox, true, this.rightBox, true]);
      this._control.restartGame();
    });
  }

  startGame() {
    this.setVisble([this.maskOrder, false, this.ruleOrder, false, this.scoreOrder, true]);
    this._control.startGame(StartUI.instance.openMusic);//开始游戏
  }

  stopGame() {
    this.setVisble([this.backBtn, true, this.leftBox, false, this.rightBox, false]);
    this._control.stopGame();
    if (this.firstTime) {
      this.firstTime = false;
      this.shareBtn.visible = true;
    } else {
      this._control._started = false;
      this._control.createStoneInterval = 500;
    }
  }

  addScore(score) {
    this._control.addScore(score);
  }

  setVisble(element) {
    for (let i = 0; i < element.length; i+=2){
      element[i].visible = element[i+1];
    }
  }

  //创建分享复活页面
  createShareView(score) {
    if (Laya.Browser.onMiniGame) {
      let canvas = wx.createCanvas();
      canvas.width = 318;
      canvas.height = 238;
      let context = canvas.getContext('2d');
      let bg = wx.createImage();
      bg.src = 'images/bgm.png';
      bg.onload = () => {
        context.drawImage(bg, 0, 0, 318, 238);
        context.fillStyle = "rgba(0,0,0,1)";
        context.font = "bold 30px Arial";
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillText(score + " M", 150, 100);
        wx.shareAppMessage({
          title: "我在【神手Plus】跑了" + score + "米，敢与我比比吗？",
          imageUrl: canvas.toTempFilePathSync({
            destWidth: 640,
             destHeight: 480
          })
        });
      }
    }
  }
}