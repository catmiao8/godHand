import GameUI from "./GameUI";
/**
 * 星星脚本，实现星星碰撞及回收流程
 */

 export default class Star extends Laya.Script {
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