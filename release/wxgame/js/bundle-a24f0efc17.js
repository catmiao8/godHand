(function () {
  'use strict';

  class StartUI extends Laya.Scene {
    constructor() {
      super();
      //设置单例的引用方式，方便其他类引用
      StartUI.instance = this;
      this.openMusic = true;//是否打开音乐
      this.createInterval = 600;//默认间隔时间
      Laya.SoundManager.useAudioMusic = false;//通过设备静音键让音频自动跟随设备静音
      //加载场景文件
      this.loadScene("scene/startScene.scene");
    }

    onEnable() {
      if (Laya.Browser.onMiniGame){
        wx.showShareMenu();
        const button = wx.createUserInfoButton({
          type: 'text',
          text: '',
          style: {
            left: 100,
            top: 260,
            width: 200,
            height: 50,
            backgroundColor: 'rgba(0,0,0,0)',
          }
        });
        button.onTap((userinfo)=>{
          if (wx.getStorageSync('userInfo')) {
            Laya.Scene.open("scene/startScene.scene");
          }else {
            wx.login({
              success(res) {
                if (res.code) {
                  Laya.Scene.open("scene/startScene.scene");
                }else {
                  console.log('登录失败！' + res.errMsg);
                }
              }
            });
          }
        });
      }
      
      //点击打开游戏背景音乐按钮
      this.openMusicBtn.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.openMusicBtn.visible = false;
        this.closeMusicBtn.visible = true;
        this.openMusic = true;
      });

      //点击关闭游戏背景音乐按钮
      this.closeMusicBtn.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.openMusicBtn.visible = true;
        this.closeMusicBtn.visible = false;
        this.openMusic = false;
      });

      //点击开始游戏
      this.startGameBtn.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        Laya.Scene.open("scene/gameScene.scene");
      });

      //点击选择模式
      this.selectMode.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.mode.visible = true;
      });
      
      //点击排行榜
      this.rankingList.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
      });

      //点击游戏规则
      this.gameRules.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        Laya.Tween.from(this.rule, {scaleY: 0, scaleX: 0}, 100);
        this.rule.visible = true;
      });

      //点击规则面板
      this.rule.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        Laya.Tween.to(this.rule, {scaleY: 0, scaleX: 0}, 100, null, Laya.Handler.create(this, ()=>{
          this.rule.visible = false;
          this.rule.scaleX = 1;
          this.rule.scaleY = 1;
        }));
      });

      //选择简单模式
      this.easy.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.mode.visible = false;
        this.createInterval = 800;
      });

      //选择一般模式
      this.normal.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.mode.visible = false;
        this.createInterval = 600;
      });

      //选择困难模式
      this.hard.on(Laya.Event.CLICK, this, ()=>{
        Laya.SoundManager.playSound("sound/click.mp3", 1);
        this.mode.visible = false;
        this.createInterval = 500;
      });

      this.mode.on(Laya.Event.CLICK, this, ()=>{
        this.mode.visible = false;
      });
    }
  }

  class GameControl extends Laya.Script {
    /** @prop {name:stone,tips:"下降石头预制体对象",type:Prefab}*/
    /** @prop {name:star,tips:"星星预制体对象",type:Prefab}*/
    /** @prop {name:createStartProbability,tips:"下降星星的概率",type:number,default:0.2}*/

    constructor() { 
      super(); 
      this._score = 0;//初始分数
      this._time = Date.now();//开始时间
      this._startTime = this._time;//每隔1000毫秒分数加1
      this._started = false;//是否已经开始游戏
      this.createStoneInterval = 800;//间隔多少毫秒创建一个下落的石头
      this.stonePos = [[130, 424], [130, 568], [280, 424], [280, 568]];//石头随机位置
      this.starPos = [130, 280, 424, 568];//星星随机位置
      this.createStartProbability = 0.2;//星星下落的概率
    }

    onEnable() {
      //石头所在的容器对象
      this._gameBox = this.owner.getChildByName("gameBox");
    }

    onUpdate() {
      let now = Date.now();
      //每间隔一段时间创建石头和星星
      if (now - this._time > this.createStoneInterval && this._started) {
          this._time = now;
          this.createStone();
          this.createStar();
      }
      //每间隔一段时间分数加1
      if (now - this._startTime > 1000 && this._started) {
        this._startTime = now;
        this.addScore(1);
      }
    }

    /**创建石头*/
    createStone() {
      //使用对象池创建盒子
      let randomPos = Math.floor(Math.random() * 4);//随机一组位置
      let stone1 = Laya.Pool.getItemByCreateFun("stone", this.stone.create, this.stone);
      this.setStoneTexture(stone1, this.stonePos[randomPos][0]);
      let stone2 = Laya.Pool.getItemByCreateFun("stone", this.stone.create, this.stone);
      this.setStoneTexture(stone2, this.stonePos[randomPos][1]);
    }

    //设置石头纹理和位置,并添加到石头容器中
    setStoneTexture(stone, posX) {
      let randomNumer = Math.floor(Math.random() * 3) + 1;//从三种石头中随机取一种石头
      stone.loadImage("images/stone" + randomNumer + ".png");
      stone.pos(posX, -22);
      stone.pivot(stone.width / 2, stone.height / 2);
      this._gameBox.addChild(stone);
    }

    /**修改分数*/
    addScore(score) {
      this._score += score;
      this._scoreText.changeText("" + this._score + "m");
      //随着分数升高，游戏难度加大
      if (this.createStoneInterval > 300 && this._score % 20 === 0)
        this.createStoneInterval -= 20;
    }

    /**创建星星*/
    createStar() {
      let randomNumer = Math.floor(1 / this.createStartProbability * Math.random());
      if (randomNumer === 0) {
        let number = Math.floor(4 * Math.random());
        let star = Laya.Pool.getItemByCreateFun("star", this.star.create, this.star);
        star.pos(this.starPos[number], -200);
        this._gameBox.addChild(star);
      }
    }

    /**开始游戏，通过激活本脚本方式开始游戏*/
    startGame(openMusic) {
      this._started = true;
      if (openMusic)
        Laya.SoundManager.playMusic("sound/bgmusic.mp3", 0);
      this._scoreText = new Laya.Text();
      this._scoreText.width = 160,
      this._scoreText.height = 61.6;
      this._scoreText.zOrder = 120;
      this._scoreText.text = "0m";
      this._scoreText.align = "center";
      this._scoreText.valign = "middle";
      this._scoreText.color = "#ffffff";
      this._scoreText.font = "SimHei";
      this._scoreText.fontSize = 35;
      this._scoreText.pos(240, 16);
      Laya.stage.addChild(this._scoreText);
    }

    /**结束游戏，通过非激活本脚本停止游戏 */
    stopGame() {
      this._started = false;
      this.stopMoving();
      Laya.SoundManager.playMusic("sound/error.mp3", 1);
    }

    /**盒子中的石头和星星停止位移 */
    stopMoving() {
      for (let i = 0; i< this._gameBox.numChildren; i++) {
        let child = this._gameBox.getChildAt(i);
        if (child.name === "stone" || child.name === "star") {
          child.stopDisplacement = false;
        }
      }
    }

    //重新开始游戏
    restartGame() {
      for (let i = 0; i< this._gameBox.numChildren; i++) {
        let child = this._gameBox.getChildAt(i);
        if (child.name === "stone" || child.name === "star") {
          if(child.y > 400) {
            i--;
            child.removeSelf();
            continue;
          }
          child.stopDisplacement = true;
        }
      }
      this._time = Date.now();
      this._started = true;
    }

    /**移除分数文本 */
    removeScoreText() {
      this._scoreText.destroy();
    }

    //设置创建石头的间隔时间
    setCreateStoneInterval(time) {
      this.createStoneInterval = time;
    }
  }

  class GameUI extends Laya.Scene{
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
        };
      }
    }
  }

  /**
   * 蘑菇精灵脚本，实现蘑菇碰撞逻辑
   */

  class Mushroom extends Laya.Script {
    constructor() {
      super();
    }

    onTriggerEnter(other, self, contact) {
      if (other.label === "stone") {
        GameUI.instance.stopGame();
      }
    }
  }

  /**
   * 星星脚本，实现星星碰撞及回收流程
   */

   class Star extends Laya.Script {
    constructor() {
      super();
    }
    
    onEnable() {
      this.owner.stopDisplacement = true;
    }

    onUpdate() {
      //让星星位置下移
      if (this.owner.stopDisplacement){
        this.owner.y += 10;
      }
      if (this.owner.y > 1170) {
        this.owner.removeSelf();
      }
    }

    onTriggerEnter(other, self, contact) {
      //碰撞到蘑菇就移除
      if (other.label === "mushroom") {
        GameUI.instance.addScore(1);
        Laya.SoundManager.playSound("sound/reward.mp3", 1);
        this.owner.removeSelf();
      }
    }

     onDisable() {
      //星星被移除时，回收星星到对象池，方便下次复用，减少对象创建开销。
      Laya.Pool.recover("star", this.owner);
    }
  }

  /**
   * 石头脚本，实现石头碰撞及回收流程
   */

   class Stone extends Laya.Script {
    constructor() {
      super();
      this.stopDisplacement = true;
    }
   
    onEnable() {
      this.owner.stopDisplacement = true;
    }

    onUpdate() {
      //让石头位置下移
      if (this.owner.stopDisplacement) {
        this.owner.y += 10;
      }
      if (this.owner.y > 1170) {
        this.owner.removeSelf();
      }
    }

    onDisable() {
      //石头被移除时，回收石头到对象池，方便下次复用，减少对象创建开销。
      Laya.Pool.recover("stone", this.owner);
    }
  }

  /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

  class GameConfig {
      static init() {
          //注册Script或者Runtime引用
          let reg = Laya.ClassUtils.regClass;
  		reg("script/GameUI.js",GameUI);
  		reg("script/Mushroom.js",Mushroom);
  		reg("script/GameControl.js",GameControl);
  		reg("script/StartUI.js",StartUI);
  		reg("script/Star.js",Star);
  		reg("script/Stone.js",Stone);
      }
  }
  GameConfig.width = 640;
  GameConfig.height = 1136;
  GameConfig.scaleMode ="showall";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "scene/startScene.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;

  GameConfig.init();

  class Main {
  	constructor() {
  		//根据IDE设置初始化引擎		
  		if (window["Laya3D"])
  			Laya3D.init(GameConfig.width, GameConfig.height);
  		else
  			Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
  		Laya["Physics"] && Laya["Physics"].enable();
  		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
  		Laya.stage.scaleMode = GameConfig.scaleMode;
  		Laya.stage.screenMode = GameConfig.screenMode;
  		Laya.stage.alignV = GameConfig.alignV;
  		Laya.stage.alignH = GameConfig.alignH;
  		//兼容微信不支持加载scene后缀场景
  		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

  		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
  		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
  		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
  		if (GameConfig.stat) Laya.Stat.show();
  		Laya.alertGlobalError(true);

  		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
  		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
  	}

  	onVersionLoaded() {
  		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
  		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  	}

  	onConfigLoaded() {
  		//加载游戏背景
  		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
  	}
  }
  //激活启动类
  new Main();

}());
