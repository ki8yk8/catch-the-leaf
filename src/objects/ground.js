export function Ground({ k, ground_height }) {
	const ground = k.add([
		k.rect(k.width(), ground_height),
		k.pos(k.width() / 2, k.height()),
		k.color("#011627"),
		k.anchor("bot"),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	return ground;
}
