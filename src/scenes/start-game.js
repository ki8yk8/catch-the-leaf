export function registerStartScene(k) {
	k.scene("startgame", () => {
		const title_text = k.add([
			k.text("Catch the Leaf", {
				size: 32,
				align: "center",
			}),
			k.color("#000000"),
			k.pos(k.width() / 2, k.height() / 2),
			k.anchor("center"),
		]);
		
		const start_text = k.add([
			k.text("Press any key to start the game", {
				size: 18,
				align: "center",
			}),
			k.pos(k.width() / 2, k.height() / 2 + title_text.height),
			k.anchor("center"),
			k.color("#ff0000"),
		]);

		k.onKeyPress("space", () => {
			k.go("gameplay");
		})
	});
}
