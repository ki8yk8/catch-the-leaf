export function registerGameOverScene({ k }) {
	k.scene("gameover", (score) => {
		// play the failed sound
		k.play("gameover");

		const score_title = k.add([
			k.text("You Scored", {
				size: 18,
				align: "center",
			}),
			k.anchor("center"),
			k.pos(k.width() / 2, k.height() / 3),
			k.color("#000000"),
		]);

		const score_text = k.add([
			k.text(score.toString(), {
				size: 64,
				align: "center",
			}),
			k.anchor("top"),
			k.pos(k.width() / 2, score_title.pos.y + 16),
			k.color("#00ff00"),
		]);

		const continue_text = k.add([
			k.text("Press any key to continue", {
				size: 18,
				align: "center",
			}),
			k.anchor("top"),
			k.pos(k.width() / 2, k.height() / 3 + 18 + 64 + 16),
			k.color("#ff0000"),
		]);

		k.onKeyPress(() => {
			k.go("startgame");
		});
	});
}
