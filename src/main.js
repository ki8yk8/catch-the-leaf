import kaplay from "kaplay";
import { registerLoadingScene } from "./scenes/loading";

const user_screen_size = Math.floor(window.innerWidth / 64) * 64;

const k = kaplay({
	canvas: document.getElementById("game"),
	background: "#fdfffc",
	width: Math.min(user_screen_size, 768),
	height: window.innerHeight,
	scale: 1,
	stretch: false,
	global: false,
	font: "atma-regular",
});

k.loadRoot("./");

await k.loadFont("atma-bold", "/fonts/atma-bold.ttf");
await k.loadFont("atma-regular", "/fonts/atma-regular.ttf");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

k.setGravity(400);

const GAME_PADDING = 64;

k.loadSprite("steel", "/sprites/steel.png");

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

registerLoadingScene({ k, padding: GAME_PADDING });
k.go("loading");
