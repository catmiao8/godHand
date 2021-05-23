
export default class GameControl extends Laya.Script {
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
      let number = Math.floor(4 * Math.random())
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