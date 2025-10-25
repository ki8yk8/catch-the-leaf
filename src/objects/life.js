export function Life({ k, padding, mode, onCatch }) {
	const life = k.add([
		k.sprite(mode ? "heart-dark" : "heart-light"),
		k.area(),
		k.body(),
		k.pos(k.rand(padding, k.width() - padding), 0),
		k.anchor("center"),
		{ mode },
		"life",
	]);
	k.play("life");

	k.onUpdate(() => {
		// handle life transition from night mode to dark mode
		if (life) {
			if (life.mode && life.sprite === "heart-light") {
				life.use(k.sprite("heart-dark"));
			} else if (!life.mode && life.sprite === "heart-dark") {
				life.use(k.sprite("heart-light"));
			}
		}
	});

	life.onCollide("ground", () => {
		k.play("drop");
		k.wait(1, () => k.destroy(life));
	});

	life.onCollide("eat-area", () => {
		k.play("life-increase");
		k.destroy(life);
		onCatch?.();
	});

	return life;
}
