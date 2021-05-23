export default class StartUI extends Laya.Scene {
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
      })
      button.onTap((userinfo)=>{
        if (wx.getStorageSync('userInfo')) {
          Laya.Scene.open("scene/startScene.scene")
        }else {
          wx.login({
            success(res) {
              if (res.code) {
                Laya.Scene.open("scene/startScene.scene");
              }else {
                console.log('登录失败！' + res.errMsg)
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