const GRASS_SIZE = 64;

export function Ground({ k, ground_height }) {
	const ground_rect = k.add([
		k.rect(k.width(), ground_height),
		k.pos(0, k.height() - ground_height),
		k.anchor("topleft"),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	const total_grasses = Math.ceil(k.width() / GRASS_SIZE);
	for (let i = 0; i < total_grasses; i++) {
		ground_rect.add([k.sprite("grass"), k.pos(i * GRASS_SIZE, 0), k.z(2)]);
	}

	return ground_rect;
}
