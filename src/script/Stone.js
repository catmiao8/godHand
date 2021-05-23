/**
 * 石头脚本，实现石头碰撞及回收流程
 */

 export default class Stone extends Laya.Script {
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