import { Basket } from "../objects/basket";
import { Ground } from "../objects/ground";
import { Hearts } from "../objects/hearts";
import { spawn_leaf } from "../objects/leaf";
import { Scenery } from "../objects/scenery";

const LEAF_INTERVAL = 1; // in seconds
const GROUND_HEIGHT = 64;
const MAX_GROUND_LEAFS = 5;
const LEVEL_INCREASE_SCORE = 5;

export function registerGameplayScene({ k, padding }) {
	k.scene("gameplay", () => {
		const game = {
			timer: 3,
			score: 0,
			ground_leafs: 0,
			level: 1,
		};

		const scenery = Scenery({ k, ground_height: GROUND_HEIGHT, padding });
		const ground = Ground({
			k,
			ground_height: GROUND_HEIGHT,
			padding,
		});
		const basket = Basket({
			k,
			ground_height: GROUND_HEIGHT,
			padding,
		});

		let hearts_container = Hearts({ k, hearts: MAX_GROUND_LEAFS, padding });

		const score_text = k.add([
			k.text(`Score: ${game.score}`, {
				size: 32,
				align: "center",
			}),
			k.color("#000000"),
			k.anchor("topright"),
			k.pos(k.width() - 25 - padding, 25),
		]);

		const handle_leaf_caught = () => {
			game.score++;
			score_text.text = `Score: ${game.score}`;
			if (game.score > game.level * LEVEL_INCREASE_SCORE)
				handle_level_increase();
		};

		const handle_level_increase = () => {
			// increase the level word by 1
			game.level++;

			// flash the level increased message
			const level_text = k.add([
				k.text(`Level ${game.level}`, {
					size: 64,
				}),
				k.pos(k.width() / 2, k.height() / 3),
				k.color(255, 255, 255),
				k.anchor("center"),
			]);

			k.wait(1, () => k.destroy(level_text));
		};

		const handle_leaf_missed = () => {
			if (game.ground_leafs === MAX_GROUND_LEAFS) {
				k.go("gameover", game.score);
			}

			game.ground_leafs++;
			k.destroy(hearts_container);

			hearts_container = Hearts({
				k,
				hearts: MAX_GROUND_LEAFS - game.ground_leafs,
				padding,
			});
		};

		const timer_text = k.add([
			k.text(`3`, {
				size: 64,
				align: "center",
			}),
			k.pos(k.width() / 2, (k.height() * 1) / 3),
			k.color("#ffffff"),
			k.anchor("center"),
		]);
		k.play("start");

		let leaf_spawn_loop = null;
		const start_timer_loop = k.loop(1, () => {
			timer_text.text = game.timer.toString();
			game.timer--;

			if (game.timer === -1) {
				timer_text.text = "START...";
			} else if (game.timer === -2) {
				// spawn a leaf every 2 seconds
				leaf_spawn_loop = k.loop(LEAF_INTERVAL, () => {
					spawn_leaf({
						k,
						onCatch: handle_leaf_caught,
						onDrop: handle_leaf_missed,
						padding,
					});
				});
				start_timer_loop.cancel();
				k.destroy(timer_text);
			}
		});
	});
}
