function leaf_component() {
	const start = Date.now();

	return {
		id: "leaf",
		start_time: start,
	};
}

const DISAPPEAR_ON_GROUND = 3;

// randomly spawn leaf at the top
export function spawn_leaf({ k, size = [25, 25], onCatch, onDrop, padding }) {
	const leaf = k.add([
		k.sprite("leaf"),
		k.pos(k.rand(padding, k.width() - 38 - padding), 0), // randomly spawn from the top position
		k.area(), // for collision
		k.body(), // for gravity
		leaf_component(),
		"leaf",
		"leaf--falling",
	]);

	const emitter = k.add([
		k.pos(k.center()),
		k.particles(
			{
				max: 15,
				speed: [40, 90],
				lifeTime: [0.4, 0.8],
				angle: [260, 280],
				opacities: [1.0, 0.0],
				colors: [195, 106, 62],
				scale: [1, 4],
			},
			{ direction: 270, spread: 60 }
		),
	]);

	function fireEmitter() {
		emitter.pos.x = leaf.pos.x + leaf.width / 2;
		emitter.pos.y = leaf.pos.y + leaf.height;
		emitter.emit(15);
	}

	leaf.onCollide("ground", () => {
		fireEmitter();

		leaf.unuse("leaf--falling");
		leaf.use("leaf--on-ground");

		onDrop?.();
		leaf.vel.x = 0;

		k.wait(DISAPPEAR_ON_GROUND, () => {
			k.destroy(leaf);
		});
	});

	leaf.onCollide("leaf", () => {
		onDrop?.();

		k.destroy(leaf);
	});

	// leaf should come with slight rotation
	leaf.onUpdate(() => {
		if (!leaf.is("leaf--on-ground")) {
			leaf.move(Math.sin(k.time() * 3) * 10 * k.dt(), 0);
			leaf.angle = Math.sin(k.time() * 3) * 10;
		}
	});

	leaf.onCollide("eat-area", () => {
		k.destroy(leaf);
		onCatch?.();
	});
}
