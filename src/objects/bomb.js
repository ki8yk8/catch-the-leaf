export function Bomb({ k, padding }) {
	const bomb = k.add([
		k.sprite("firing"),
		k.pos(k.rand(padding, k.width() - padding - 32), 0),
		k.anchor("bot"),
		k.area(),
		k.body(),
		"bomb",
		"harmful",
	]);

	bomb.onCollide("ground", () => {
		k.debug.log("bomb on ground")
	})

	return bomb;
}
