export function registerGameOverScene({ k, padding }) {
	k.scene("gameover", (score) => {
		// play the failed sound
		k.play("gameover");
		
		const game_screen = k.add([
			k.rect(k.width() - 2 * padding, k.height()),
			k.anchor("topleft"),
			k.pos(padding, 0),
			k.color("#86DB3C"),
		]);

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
		
		const hint_text = game_screen.add([
			k.text("Press any key to go back...", {
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

		k.onKeyPress(() => k.go("startgame"));

	});
}
