import kaplay from "kaplay";
import { registerGameplayScene } from "./scenes/gameplay";
import { registerStartScene } from "./scenes/start-game";
import { registerGameOverScene } from "./scenes/gameover";

const k = kaplay({
	canvas: document.getElementById("game"),
	background: "#fdfffc",
	width: 600,
	height: window.innerHeight,
	scale: 1,
	stretch: false,
	global: false,
});

k.loadRoot("./");

k.loadSprite("heart", "/sprites/heart.png");
k.loadSprite("steel", "/sprites/steel.png");
k.loadSprite("grass", "/sprites/grass.png");
k.loadSprite("leaf", "/sprites/leaf.png");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

k.setGravity(400);

registerGameplayScene(k);
registerStartScene(k);
registerGameOverScene(k);

k.go("startgame");
