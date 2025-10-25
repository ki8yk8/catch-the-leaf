import { Basket } from "../objects/basket";
import { Bomb } from "../objects/bomb";
import { Ground } from "../objects/ground";
import { Hearts } from "../objects/hearts";
import { spawn_leaf } from "../objects/leaf";
import { Life } from "../objects/life";
import { Scenery } from "../objects/scenery";

const LEAF_INTERVAL = 2; // in seconds
const LEAF_INTERVAL_SLOPE = 0.1;
const BOMB_INTERVAL = 5;
const BOMB_SLOPE = 0.02;
const HEART_INTERVAL = 10;
const GROUND_HEIGHT = 64;
const MAX_GROUND_LEAFS = 5;
const LEVEL_INCREASE_SCORE = 5;
const BONUS_LEVEL = 5;

export function registerGameplayScene({ k, padding }) {
	k.scene("gameplay", () => {
		const game = {
			timer: 3,
			score: 0,
			ground_leafs: 0,
			level: 1,
		};

		let mode = Math.floor(game.level / 4) % 2;

		const scenery = Scenery({ k, ground_height: GROUND_HEIGHT, padding, mode });
		const ground = Ground({
			k,
			ground_height: GROUND_HEIGHT,
			padding,
			mode,
		});
		const basket = Basket({
			k,
			ground_height: GROUND_HEIGHT,
			padding,
		});

		let hearts_container = Hearts({
			k,
			hearts: MAX_GROUND_LEAFS,
			padding,
			mode,
		});

		const score_text = k.add([
			k.text(`Score: ${game.score}`, {
				size: 32,
				align: "center",
			}),
			k.color(mode ? "#ffffff" : "#000000"),
			k.anchor("topright"),
			k.pos(k.width() - 25 - padding, 25),
			k.z(1),
		]);

		const handle_leaf_caught = () => {
			game.score++;
			score_text.text = `Score: ${game.score}`;
			if (game.score > game.level * LEVEL_INCREASE_SCORE)
				handle_level_increase();
		};

		let bomb_spawn_loop = null;
		let first_bomb = false;
		let heart_spawn_loop = null;
		let life = null;
		const handle_level_increase = () => {
			// increase the level word by 1
			game.level++;

			mode = Math.floor(game.level / 4) % 2;
			scenery.mode = mode;
			ground.mode = mode;
			hearts_container.mode = mode;
			if (life) life.mode = mode;
			score_text.use(k.color(mode ? "#ffffff" : "#000000"));

			// flash the level increased message
			const level_text = k.add([
				k.text(`Level ${game.level}`, {
					size: 72,
				}),
				k.pos(k.width() / 2, k.height() / 3),
				k.color(k.Color.fromHex("#01FE09")),
				k.anchor("center"),
			]);
			// play sound
			k.play("level");

			k.wait(1, () => k.destroy(level_text));

			// cancels the current spawn loop
			leaf_spawn_loop.cancel();

			// if this is BONUS level then, the number of leafs to increment the user to next level should appear linearly
			if (game.level % BONUS_LEVEL === 0) {
				const random_x = k.rand(padding, k.width() - 38 - padding);

				let i = 0;
				const bonus_loop = k.loop(0.5, () => {
					spawn_leaf({
						k,
						x: random_x,
						onCatch: handle_leaf_caught,
						onDrop: handle_leaf_missed,
						padding,
					});
					i++;
					if (i >= LEVEL_INCREASE_SCORE - 1) {
						bonus_loop.cancel();
					}
				});

				// after all bonus leafs are spawned then drop the regular leafs
				k.wait(0.5 * LEVEL_INCREASE_SCORE, () => {
					leaf_spawn_loop = k.loop(
						LEAF_INTERVAL * (1 - LEAF_INTERVAL_SLOPE) ** game.level,
						() => {
							spawn_leaf({
								k,
								onCatch: handle_leaf_caught,
								onDrop: handle_leaf_missed,
								padding,
							});
						}
					);
				});

				return;
			}

			// new loop with increased leaf_interval by LEAF_INTERVAL_SLOPE every level
			leaf_spawn_loop = k.loop(
				LEAF_INTERVAL * (1 - LEAF_INTERVAL_SLOPE) ** game.level,
				() => {
					spawn_leaf({
						k,
						onCatch: handle_leaf_caught,
						onDrop: handle_leaf_missed,
						padding,
					});
				}
			);

			// on level increase start spawning the bombs or increase the bombing frequency
			if (bomb_spawn_loop) bomb_spawn_loop.cancel();
			first_bomb = true;
			bomb_spawn_loop = k.loop(
				BOMB_INTERVAL * (1 - BOMB_SLOPE) ** game.level,
				() => {
					if (first_bomb) {
						// skip this bomb
						first_bomb = false;
						return;
					}
					Bomb({ k, padding, onHit: handle_bomb_hit, mode });
				}
			);
		};

		// on bomb hit score decreases by 10
		const handle_bomb_hit = () => {
			game.score = Math.max(0, game.score - 10);
			score_text.text = `Score: ${game.score}`;
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
				mode,
			});
		};

		const handle_heart_caught = () => {
			game.ground_leafs--;
			k.destroy(hearts_container);

			hearts_container = Hearts({
				k,
				hearts: MAX_GROUND_LEAFS - game.ground_leafs,
				padding,
				mode,
			});
		};

		const timer_text = k.add([
			k.text(`3`, {
				size: 72,
				align: "center",
			}),
			k.pos(k.width() / 2, (k.height() * 1) / 3),
			k.color("#FED701"),
			k.anchor("center"),
		]);
		k.play("start");

		let leaf_spawn_loop = null;
		let first_heart = true;
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

				heart_spawn_loop = k.loop(HEART_INTERVAL, () => {
					if (first_heart) {
						first_heart = false;
						return;
					}
					life = Life({ k, padding, onCatch: handle_heart_caught });
				});

				start_timer_loop.cancel();
				k.destroy(timer_text);
			}
		});
	});
}
