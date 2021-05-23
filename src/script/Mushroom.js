/**
 * 蘑菇精灵脚本，实现蘑菇碰撞逻辑
 */
import GameUI from './GameUI'

export default class Mushroom extends Laya.Script {
  constructor() {
    super();
  }

  onTriggerEnter(other, self, contact) {
    if (other.label === "stone") {
      GameUI.instance.stopGame();
    }
  }
}