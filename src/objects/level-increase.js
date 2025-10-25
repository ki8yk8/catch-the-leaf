export function LevelIncrease({ k, level }) {
	// flash the level increased message
	const level_text = k.add([
		k.text(`Level ${level}`, {
			size: 72,
		}),
		k.pos(k.width() / 2, k.height() / 3),
		k.color(k.Color.fromHex("#01FE09")),
		k.anchor("center"),
	]);
	// play sound
	k.play("level");

	k.wait(1, () => k.destroy(level_text));
}
