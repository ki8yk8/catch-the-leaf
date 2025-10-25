import { Confetti } from "../objects/confetti";

const LEAF_SIZE = 64;
const LEAF_GAP = 32;

export function registerGameOverScene({ k, padding }) {
	k.scene("gameover", (score) => {
		// play the failed sound
		k.play("gameover");
		let bg_music = null;
		k.wait(1, () => {
			bg_music = k.play("music");
		});

		const game_screen = k.add([
			k.rect(k.width() - 2 * padding, k.height()),
			k.anchor("topleft"),
			k.pos(padding, 0),
			k.color("#86DB3C"),
		]);

		// drawing moving cells of leaf
		const n_horizontal_leaf = Math.ceil(game_screen.width / LEAF_SIZE);
		const n_vertical_leaf = Math.ceil(game_screen.height / LEAF_SIZE);
		// spawning those leafs
		for (let i = 0; i < n_vertical_leaf; i++) {
			for (let j = 0; j < n_horizontal_leaf; j++) {
				const bgleaf = game_screen.add([
					k.sprite("leaf"),
					k.pos(
						i * LEAF_SIZE + i * LEAF_GAP + LEAF_SIZE / 2,
						j * LEAF_SIZE + j * LEAF_GAP + LEAF_SIZE / 2
					),
					"bgleaf",
					k.z(-1),
					k.scale(1),
					k.rotate(0),
					k.animate({ relative: true }),
					k.anchor("center"),
				]);

				bgleaf.animate("scale", [k.vec2(1), k.vec2(1.5), k.vec2(1)], {
					duration: 2,
					easing: k.easings.easeInOutQuad,
				});

				bgleaf.animate("angle", [k.rand(0, 45), k.rand(-45, 0)], {
					direction: "ping-pong",
					duration: 1.25,
					easing: k.easings.easeInOutQuad,
				});

				bgleaf.animate(
					"pos",
					[
						k.vec2(k.rand(-10, 10), k.rand(-10, 10)),
						k.vec2(0, 0),
						k.vec2(k.rand(-10, 10), k.rand(-10, 10)),
					],
					{
						duration: 1.5,
						direction: "ping-pong",
						easing: k.easings.easeInOutQuad,
					}
				);
			}
		}

		const score_title = game_screen.add([
			k.text("You Scored", {
				font: "atma-bold",
				size: 32,
				align: "center",
			}),
			k.anchor("center"),
			k.pos(game_screen.width / 2, game_screen.height / 3),
			k.color("#000000"),
		]);

		const score_text = game_screen.add([
			k.text(score.toString(), {
				size: 100,
				align: "center",
			}),
			k.anchor("top"),
			k.pos(game_screen.width / 2, score_title.pos.y + 32),
			k.color("#ffffff"),
		]);
		// adding confettis
		const left_confetti = Confetti({
			k,
			rotate: false,
			pos: [k.width() / 2 - 100, score_text.pos.y + 80],
		});
		const right_confetti = Confetti({
			k,
			rotate: true,
			pos: [k.width() / 2 + 100, score_text.pos.y + 80],
		});

		k.wait(0.6, () => {
			left_confetti.emit(100);
			k.play("confetti");

			k.wait(0.2, () => {
				k.play("confetti");
				right_confetti.emit(100);
			});
		});

		const hint_text = game_screen.add([
			k.text("Press space to go back...", {
				font: "atma-bold",
			}),
			k.anchor("bot"),
			k.pos(game_screen.width / 2, game_screen.height - 100),
			k.animate({
				relative: true,
			}),
		]);

		// bouncy effect of hint text
		hint_text.animate("scale", [k.vec2(1), k.vec2(1.05), k.vec2(1)], {
			duration: 1,
			easing: k.easings.easeInBounce,
		});

		k.onKeyPress("space", () => {
			if (bg_music) bg_music.stop();
			k.go("startgame");
		});
	});
}
