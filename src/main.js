import kaplay from "kaplay";
import { registerGameplayScene } from "./scenes/gameplay";
import { registerStartScene } from "./scenes/start-game";
import { registerGameOverScene } from "./scenes/gameover";
import { registerInstructionsScene } from "./scenes/instructions";

const k = kaplay({
	canvas: document.getElementById("game"),
	background: "#fdfffc",
	width: 768,
	height: window.innerHeight,
	scale: 1,
	stretch: false,
	global: false,
	font: "atma-regular",
});

k.loadRoot("./");

k.loadFont("atma-bold", "/fonts/atma-bold.ttf");
k.loadFont("atma-regular", "/fonts/atma-regular.ttf");

k.loadSprite("heart-light", "/sprites/heart-light.png");
k.loadSprite("heart-dark", "/sprites/heart-dark.png");
k.loadSprite("steel", "/sprites/steel.png");
k.loadSprite("grass", "/sprites/grass.png");
k.loadSprite("leaf", "/sprites/leaf.png");
k.loadSprite("butterfly", "/sprites/btfly.png");
k.loadSprite("ghost", "/sprites/ghost.png");
k.loadSprite("cloud-light", "/sprites/cloud-light.png");
k.loadSprite("cloud-dark", "/sprites/cloud-dark.png");
k.loadSprite("flower-light", "/sprites/flowy-light.png");
k.loadSprite("flower-dark", "/sprites/flowy-dark.png");
k.loadSprite("moon", "/sprites/moon.png");
k.loadSprite("mushroom-light", "/sprites/mushroom-light.png");
k.loadSprite("mushroom-dark", "/sprites/mushroom-dark.png");
k.loadSprite("sun", "/sprites/sun.png");
k.loadSprite("firing-light", "/sprites/firing-light.png");
k.loadSprite("firing-dark", "/sprites/firing-dark.png");
k.loadSprite("logo", "/sprites/logo.png");

// loading sound starts here
k.loadSound("catch", "/sounds/catch.mp3");
k.loadSound("click", "/sounds/click.mp3");
k.loadSound("drop", "/sounds/drop.mp3");
k.loadSound("gameover", "/sounds/gameover.mp3");
k.loadSound("start", "/sounds/start.mp3");
k.loadSound("level", "/sounds/level.mp3");
k.loadSound("fireball-impact", "/sounds/fireball-impact.mp3");
k.loadSound("fireball", "/sounds/fireball-incoming.mp3");
k.loadSound("music", "/sounds/music.mp3");
k.loadSound("life", "/sounds/life.mp3");
k.loadSound("life-increase", "/sounds/life-increase.mp3");

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
registerInstructionsScene({ k, padding: GAME_PADDING });

k.go("startgame");
