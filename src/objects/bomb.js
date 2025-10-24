export function Bomb({ k, padding, onHit, mode = 0 }) {
	const bomb = k.add([
		k.sprite(mode ? "firing-dark" : "firing-light"),
		k.pos(k.rand(padding, k.width() - padding - 32), 0),
		k.anchor("bot"),
		k.area(),
		k.body(),
		"bomb",
		"harmful",
	]);

	const outer_explosion_emitter = k.add([
		k.pos(k.center()),
		k.particles(
			{
				max: 50,
				speed: [70, 120],
				lifeTime: [0.8, 1.0],
				angle: [0, 360],
				opacities: [1.0, 0.0],
				colors: [k.rgb([237, 31, 32])],
				scale: [1.0, 0.3],
			},
			{ direction: 0, spread: 360 }
		),
	]);

	const inner_explosion_emitter = k.add([
		k.pos(k.center()),
		k.particles(
			{
				max: 50,
				speed: [40, 90],
				lifeTime: [0.4, 0.5],
				angle: [0, 360],
				opacities: [1.0, 0.0],
				colors: [k.rgb([248, 243, 167])],
				scale: [1.0, 0.3],
			},
			{ direction: 0, spread: 260 }
		),
	]);

	k.play("fireball");

	function extinguishFireball() {
		inner_explosion_emitter.pos.x = bomb.pos.x;
		outer_explosion_emitter.pos.x = bomb.pos.x;
		inner_explosion_emitter.pos.y = bomb.pos.y;
		outer_explosion_emitter.pos.y = bomb.pos.y;
		inner_explosion_emitter.emit(15);
		outer_explosion_emitter.emit(20);
		k.wait(2, () => {
			k.destroy(inner_explosion_emitter);
			k.destroy(outer_explosion_emitter);
		});

		k.play("fireball-impact");

		k.destroy(bomb);
	}

	bomb.onCollide("ground", extinguishFireball);
	bomb.onCollide("leaf", (leaf) => {
		if (leaf.is("leaf--on-ground")) {
			extinguishFireball();
		}
	});
	bomb.onCollide("basket", () => {
		extinguishFireball();
		onHit?.();
	});

	bomb.onUpdate(() => {
		if (bomb.pos.y > k.height()) {
			extinguishFireball();
		}
	});

	return bomb;
}
