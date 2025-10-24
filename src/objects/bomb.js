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

	const incoming_sound = k.play("fireball", {
		loop: true,
	});

	function extinguishFireball() {
		incoming_sound.stop();
		k.play("fireball-impact");

		k.wait(1, () => k.destroy(bomb));
	}

	bomb.onCollide("ground", extinguishFireball);
	bomb.onCollide("leaf", extinguishFireball);

	return bomb;
}
