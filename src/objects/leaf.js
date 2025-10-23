function leaf_component() {
	const start = Date.now();

	return {
		id: "leaf",
		start_time: start,
	};
}

const DISAPPEAR_ON_GROUND = 3;

// randomly spawn leaf at the top
export function spawn_leaf({k, size = [25, 25], onCatch, onDrop}) {
	const leaf = k.add([
		k.sprite("leaf"),
		k.pos(k.rand(0, k.width()-38), 0), // randomly spawn from the top position
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

		k.wait(DISAPPEAR_ON_GROUND, () => {
			k.destroy(leaf);
		})
	});

	leaf.onCollide("eat-area", () => {
		k.destroy(leaf);
		onCatch?.();
	})
}