import kaplay from "kaplay";
import { registerLoadingScene } from "./scenes/loading";

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

await k.loadFont("atma-bold", "/fonts/atma-bold.ttf");
await k.loadFont("atma-regular", "/fonts/atma-regular.ttf");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

k.setGravity(400);

const GAME_PADDING = 64;

registerLoadingScene({ k, padding: GAME_PADDING });
k.go("loading");
