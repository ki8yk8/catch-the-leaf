const GRASS_SIZE = 64;

export function Ground({ k, ground_height, padding, mode = 0 }) {
	const ground_rect = k.add([
		k.rect(k.width() - 2 * padding, ground_height),
		k.pos(padding, k.height() - ground_height),
		k.anchor("topleft"),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
		{ mode },
	]);

	const total_grasses = Math.ceil((k.width() - 2 * padding) / GRASS_SIZE);
	for (let i = 0; i < total_grasses; i++) {
		ground_rect.add([k.sprite("grass"), k.pos(i * GRASS_SIZE, 0), k.z(2)]);
	}

	// add some flowers
	[20, 400].forEach((pos) => {
		ground_rect.add([
			k.sprite(mode ? "flower-dark" : "flower-light"),
			k.anchor("bot"),
			k.pos(pos + padding, 0),
			"flower",
		]);
	});

	// add some mushrooms
	[480].forEach((pos) => {
		ground_rect.add([
			k.sprite(mode ? "mushroom-dark" : "mushroom-light"),
			k.anchor("bot"),
			k.pos(pos + padding, 0),
			"mushroom",
		]);
	});

	ground_rect.onUpdate(() => {
		if (ground_rect.mode) {
			ground_rect.get("mushroom").forEach((mushroom) => {
				if (mushroom.sprite === "mushroom-light") {
					mushroom.sprite = "mushroom-dark";
				}
			});

			ground_rect.get("flower").forEach((flower) => {
				if (flower.sprite === "flower-light") {
					flower.sprite = "flower-dark";
				}
			});
		} else {
			ground_rect.get("mushroom").forEach((mushroom) => {
				if (mushroom.sprite === "mushroom-dark") {
					mushroom.sprite = "mushroom-light";
				}
			});

			ground_rect.get("flower").forEach((flower) => {
				if (flower.sprite === "flower-dark") {
					flower.sprite = "flower-light";
				}
			});
		}
	});

	return ground_rect;
}
