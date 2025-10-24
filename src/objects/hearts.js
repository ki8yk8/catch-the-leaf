export function Hearts({ k, hearts, padding, mode = 0 }) {
	const hearts_container = k.add([
		k.pos(25 + padding, 25),
		k.anchor("topleft"),
		k.fixed(),
		{ mode },
	]);

	const heart_title = hearts_container.add([
		k.text("Life: ", {
			size: 32,
		}),
		k.pos(0, 0),
		k.color(mode ? "#ffffff" : "#000000"),
	]);

	updateHearts(hearts);

	function updateHearts(lifes) {
		// clearing all the hearts if it exists
		hearts_container.get("heart").forEach((heart) => {
			k.destroy(heart);
		});

		// adding new hearts
		for (let i = 0; i <= lifes; i++) {
			hearts_container.add([
				k.sprite(mode ? "heart-dark" : "heart-light"),
				k.pos(heart_title.width + i * 32, 0),
				"heart",
			]);
		}
	}

	hearts_container.onUpdate(() => {
		if (hearts_container.mode) {
			hearts_container.get("heart").forEach((heart) => {
				if (heart.sprite === "heart-light") heart.use(k.sprite("heart-dark"));
			});
			heart_title.use(k.color("#ffffff"));
		} else {
			hearts_container.get("heart").forEach((heart) => {
				if (heart.sprite === "heart-dark") heart.use(k.sprite("heart-light"));
			});
			heart_title.use(k.color("#000000"));
		}
	});

	return hearts_container;
}
