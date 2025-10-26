import { Basket } from "../objects/basket";
import { Bomb } from "../objects/bomb";
import { Ground } from "../objects/ground";
import { Hearts } from "../objects/hearts";
import { spawn_leaf } from "../objects/leaf";
import { LevelIncrease } from "../objects/level-increase";
import { Life } from "../objects/life";
import { spawn_magnet } from "../objects/magnet";
import { Scenery } from "../objects/scenery";

const LEAF_INTERVAL = 1.7; // in seconds
const LEAF_INTERVAL_SLOPE = 0.1;
const BOMB_INTERVAL = 7;
const BOMB_SLOPE = 0.09;
const HEART_INTERVAL = 17;
const MAGNET_INTERVAL = 33;

const GROUND_HEIGHT = 64;
const MAX_GROUND_LEAFS = 4;
const LEVEL_INCREASE_SCORE = 10;
const BONUS_LEVEL = 5;

export function registerGameplayScene({ k, padding }) {
	k.scene("gameplay", () => {
		const game = {
			timer: 3,
			score: 0,
			ground_leafs: 0,
			level: 1,
			active: false,
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

		const handle_level_increase = () => {
			// increase the level word by 1
			game.level++;

			mode = Math.floor(game.level / 4) % 2;
			scenery.mode = mode;
			ground.mode = mode;
			hearts_container.mode = mode;
			score_text.use(k.color(mode ? "#ffffff" : "#000000"));

			LevelIncrease({ k, level: game.level });

			// if this is BONUS level then, the number of leafs to increment the user to next level should appear linearly
			if (game.level % BONUS_LEVEL === 0) {
				const random_x = k.rand(padding, k.width() - 38 - padding);
				next_times.leaf = k.time() + 0.5 * LEVEL_INCREASE_SCORE + 1;

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

				return;
			}
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

		const start_timer_loop = k.loop(1, () => {
			timer_text.text = game.timer.toString();
			game.timer--;

			if (game.timer === -1) {
				timer_text.text = "START...";
			} else if (game.timer === -2) {
				start_timer_loop.cancel();
				k.destroy(timer_text);
			}
		});

		// counter for handling times of spawn;
		// if this time has exceeded then spawning is neede
		// three stands for the countdown we will be having
		const next_times = {
			leaf: LEAF_INTERVAL + 3 + k.time(),
			bomb: BOMB_INTERVAL + 3 + k.time(),
			heart: HEART_INTERVAL + 3 + k.time(),
			magnet: MAGNET_INTERVAL + 3 + k.time(),
		};

		function get_decrement(interval, slope, level) {
			return interval * (1 - slope) ** level;
		}

		// spawnning logic starts here
		k.onUpdate(() => {
			const now = k.time();

			if (now >= next_times.leaf) {
				spawn_leaf({
					k,
					onCatch: handle_leaf_caught,
					onDrop: handle_leaf_missed,
					padding,
				});
				next_times.leaf =
					now + get_decrement(LEAF_INTERVAL, LEAF_INTERVAL_SLOPE, game.level);

				// if the next turn is heart then, check if there is a gap of at least 1 second
				// if yes, do nothing
				// else, increase the gap and increase the leaf interval too.
				if (next_times.heart - now < 1) {
					next_times.heart = now + 1;
					next_times.leaf =
						next_times.leaf +
						get_decrement(LEAF_INTERVAL, LEAF_INTERVAL_SLOPE, game.level);
				}
			}

			if (now >= next_times.bomb) {
				// spawn the bomb and increase bomb timer plus increase next leaf time
				Bomb({ k, padding, onHit: handle_bomb_hit, mode });
				next_times.bomb = now + BOMB_INTERVAL * (1 - BOMB_SLOPE) ** game.level;
				// this is not required because it makes game easier to play
				// next_times.leaf = now + LEAF_INTERVAL;
			}

			if (now >= next_times.heart) {
				Life({ k, padding, onCatch: handle_heart_caught });
				next_times.heart = now + HEART_INTERVAL;
				next_times.leaf =
					now + get_decrement(LEAF_INTERVAL, LEAF_INTERVAL_SLOPE, game.level);
			}

			// if its time and user has crossed the first level then start spawning the magnets
			if (now >= next_times.magnet) {
				spawn_magnet({ k, basket, padding });
				next_times.magnet = now + MAGNET_INTERVAL;
				next_times.leaf =
					now + get_decrement(LEAF_INTERVAL, LEAF_INTERVAL_SLOPE, game.level);
			}
		});
	});
}
