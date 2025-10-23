function leaf_component() {
	const start = Date.now();

	return {
		id: "leaf",
		start_time: start,
	};
}

const DISAPPEAR_ON_GROUND = 3;

// randomly spawn leaf at the top
export function spawn_leaf({ k, size = [25, 25], onCatch, onDrop }) {
	const leaf = k.add([
		k.sprite("leaf"),
		k.pos(k.rand(0, k.width() - 38), 0), // randomly spawn from the top position
		k.area(), // for collision
		k.body(), // for gravity
		leaf_component(),
		"leaf",
		"leaf--falling",
	]);

	leaf.onCollide("ground", () => {
		leaf.unuse("leaf--falling");
		leaf.use("leaf--on-ground");

		onDrop?.();
		leaf.vel.x = 0;

		k.wait(DISAPPEAR_ON_GROUND, () => {
			k.destroy(leaf);
		});
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
