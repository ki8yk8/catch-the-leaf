function leaf_component() {
	const start = Date.now();

	return {
		id: "leaf",
		start_time: start,
	};
}

// randomly spawn leaf at the top
export function spawn_leaf({k, size = [25, 25], onCatch}) {
	const leaf = k.add([
		k.rect(...size),
		k.color("#ff9f1c"),
		k.pos(k.rand(0, k.width()), 0), // randomly spawn from the top position
		k.area(), // for collision
		k.body(), // for gravity
		leaf_component(),
		"leaf",
		"leaf--falling",
	]);

	leaf.onCollide("ground", () => {
		leaf.unuse("leaf--falling");
		leaf.use("leaf--on-ground");
	});

	leaf.onCollide("eat-area", () => {
		k.destroy(leaf);
		onCatch?.();
	})
}