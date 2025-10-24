export function Hearts({ k, hearts, padding }) {
	const hearts_container = k.add([
		k.pos(25 + padding, 25),
		k.anchor("topleft"),
		k.fixed(),
	]);

	const heart_title = hearts_container.add([
		k.text("Life: ", {
			size: 32,
		}),
		k.pos(0, 0),
		k.color("#000000"),
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
				k.sprite("heart"),
				k.pos(heart_title.width + i * 32, 0),
				"heart",
			]);
		}
	}

	return hearts_container;
}
