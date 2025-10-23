import { Basket } from "../objects/basket";
import { Ground } from "../objects/ground";
import { spawn_leaf } from "../objects/leaf";

const LEAF_INTERVAL = 1; // in seconds
const GROUND_HEIGHT = 40;

export function registerGameplayScene(k) {
	k.scene("gameplay", () => {
		const game = {
			timer: 3,
			score: 0,
		};

		const ground = Ground({
			k,
			ground_height: GROUND_HEIGHT,
		});
		const basket = Basket({
			k,
			ground_height: GROUND_HEIGHT,
		});

		const score_text = k.add([
			k.text(`Score: ${game.score}`, {
				size: 32,
				align: "center",
			}),
			k.color("#000000"),
			k.anchor("topright"),
			k.pos(k.width() - 25, 25),
		]);

		const handle_leaf_caught = () => {
			game.score++;
			score_text.text = `Score: ${game.score}`;
		};

		const timer_text = k.add([
			k.text(`3`, {
				size: 64,
				align: "center",
			}),
			k.pos(k.width() / 2, k.height() / 2),
			k.color("#b2b2b2"),
			k.anchor("center"),
		]);

		const start_timer_loop = k.loop(1, () => {
			timer_text.text = game.timer.toString();
			game.timer--;

			if (game.timer === -1) {
				timer_text.text = "START...";
			} else if (game.timer === -2) {
				// spawn a leaf every 2 seconds
				k.loop(LEAF_INTERVAL, () => {
					spawn_leaf({ k: k, onCatch: handle_leaf_caught });
				});
				start_timer_loop.cancel();
				k.destroy(timer_text);
			}
		});
	});
}
