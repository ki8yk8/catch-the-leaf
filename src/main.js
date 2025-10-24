import kaplay from "kaplay";
import { registerGameplayScene } from "./scenes/gameplay";
import { registerStartScene } from "./scenes/start-game";
import { registerGameOverScene } from "./scenes/gameover";

const k = kaplay({
	canvas: document.getElementById("game"),
	background: "#fdfffc",
	width: 768,
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
k.loadSprite("butterfly", "/sprites/btfly.png");
k.loadSprite("cloud", "/sprites/cloud.png");
k.loadSprite("flower", "/sprites/flowy.png");
k.loadSprite("moon", "/sprites/moon.png");
k.loadSprite("mushroom", "/sprites/mushroom.png");
k.loadSprite("sun", "/sprites/sun.png");

// loading sound starts here
k.loadSound("catch", "/sounds/catch.mp3");
k.loadSound("click", "/sounds/click.mp3");
k.loadSound("drop", "/sounds/drop.mp3");
k.loadSound("gameover", "/sounds/gameover.mp3");
k.loadSound("start", "/sounds/start.mp3");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

k.setGravity(400);

const GAME_PADDING = 64;

// adding the side borders
const total_bricks = Math.ceil(k.height() / 64);
for (let i = 0; i < total_bricks; i++) {
	k.add([
		k.sprite("steel"),
		k.pos(0, i * 64),
		k.anchor("topleft"),
		k.body({ isStatic: true }),
		k.stay(),
		k.z(10),
	]);
	k.add([
		k.sprite("steel"),
		k.pos(k.width(), i * 64),
		k.anchor("topright"),
		k.body({ isStatic: true }),
		k.stay(),
		k.z(10),
	]);
}

registerGameplayScene({ k, padding: GAME_PADDING });
registerStartScene({ k, padding: GAME_PADDING });
registerGameOverScene({ k, padding: GAME_PADDING });

k.go("startgame");
