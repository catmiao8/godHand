/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameUI from "./script/GameUI"
import Mushroom from "./script/Mushroom"
import GameControl from "./script/GameControl"
import StartUI from "./script/StartUI"
import Star from "./script/Star"
import Stone from "./script/Stone"

export default class GameConfig {
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
