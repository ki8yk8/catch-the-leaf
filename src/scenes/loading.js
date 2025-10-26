import { registerGameplayScene } from "./gameplay";
import { registerStartScene } from "./start-game";
import { registerGameOverScene } from "./gameover";
import { registerInstructionsScene } from "./instructions";

const sprites = [
	["heart-light", "/sprites/heart-light.png"],
	["heart-dark", "/sprites/heart-dark.png"],
	["steel", "/sprites/steel.png"],
	["grass", "/sprites/grass.png"],
	["leaf", "/sprites/leaf.png"],
	["butterfly", "/sprites/btfly.png"],
	["ghost", "/sprites/ghost.png"],
	["cloud-light", "/sprites/cloud-light.png"],
	["cloud-dark", "/sprites/cloud-dark.png"],
	["flower-light", "/sprites/flowy-light.png"],
	["flower-dark", "/sprites/flowy-dark.png"],
	["moon", "/sprites/moon.png"],
	["mushroom-light", "/sprites/mushroom-light.png"],
	["mushroom-dark", "/sprites/mushroom-dark.png"],
	["sun", "/sprites/sun.png"],
	["firing-light", "/sprites/firing-light.png"],
	["firing-dark", "/sprites/firing-dark.png"],
	["logo", "/sprites/logo.png"],
	["magnet", "/sprites/magnet.png"],
];

// loading sound starts here
const sounds = [
	["catch", "/sounds/catch.mp3"],
	["click", "/sounds/click.mp3"],
	["drop", "/sounds/drop.mp3"],
	["gameover", "/sounds/gameover.mp3"],
	["start", "/sounds/start.mp3"],
	["level", "/sounds/level.mp3"],
	["fireball-impact", "/sounds/fireball-impact.mp3"],
	["fireball", "/sounds/fireball-incoming.mp3"],
	["music", "/sounds/music.mp3"],
	["life", "/sounds/life.mp3"],
	["life-increase", "/sounds/life-increase.mp3"],
	["break", "/sounds/break.mp3"],
	["confetti", "/sounds/confetti.mp3"],
	["whoosh", "/sounds/whoosh.mp3"],
];

export function registerLoadingScene({ k, padding }) {
	k.scene("loading", async () => {
		let loaded = 0;
		let total = sounds.length + sprites.length;

		const loading_screen = k.add([
			k.rect(k.width() - padding * 2, k.height()),
			k.pos(k.width() / 2, k.height() / 2),
			k.anchor("center"),
			k.color("#ffffff"),
		]);

		const loading_bar = loading_screen.add([
			k.rect((k.width() * 2) / 3, 72),
			k.color("#000000"),
			k.pos(0, 0),
			k.anchor("center"),
		]);

		const loading_bar_inner = loading_screen.add([
			k.rect(0, 72 - 8 * 2),
			k.color("#ffffff"),
			k.pos(-loading_bar.width/2 +8, 0),
			k.anchor("left"),
		]);

		const loading_text = loading_bar_inner.add([
			k.text("Loading... 0%", {
				font: "atma-bold",
				size: 32,
			}),
			k.pos(loading_bar.width/2, 0),
			k.color("#ff0000"),
			k.anchor("center"),
		]);

		// load sound and sprite and once added increase the loading text and bar
		sounds.forEach(async ([name, path]) => {
			await k.loadSound(name, path);
			loaded++;
			updateLoading();
		});

		sprites.forEach(async ([name, path]) => {
			await k.loadSprite(name, path);
			loaded++;
			updateLoading();
		});

		function updateLoading() {
			const percentage = (loaded / total) * 100;
			loading_text.text = `Loading... ${Math.floor(percentage)}%`;

			const new_width = k.map(
				percentage,
				0.0,
				100.0,
				0,
				(k.width() * 2) / 3 - 8 * 2
			);
			loading_bar_inner.use(k.rect(new_width, 72 - 8 * 2));
		}

		function loadComplete() {
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
		}
	});
}
