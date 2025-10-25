export function registerInstructionsScene({ k, padding }) {
	k.scene("instructions", () => {
		const game_screen = k.add([
			k.rect(k.width() - 2 * padding, k.height()),
			k.anchor("topleft"),
			k.pos(padding, 0),
			k.color("#86DB3C"),
		]);

		// instructions starts here
		const instruction_text = game_screen.add([
			k.text(
				"Collect all the leafs in the basket to gain score. Higher the score, higher the level, and so the difficulty. \n\nBeaware of the bombs and you get rewarded with stream of easy to collect leafs every now and then.",
				{
					size: 28,
					width: (game_screen.width * 2) / 3,
					lineSpacing: 18,
					align: "center",
				}
			),
			k.pos(game_screen.width / 2, 150),
			k.anchor("top"),
			k.color("#8A2AE0"),
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
