export function Magnet({ k, padding, onCatch }) {
	const magnet = k.add([
		k.sprite("magnet"),
		k.area(),
		k.body(),
		k.pos(k.rand(padding, k.width() - padding), 0),
		k.anchor("center"),
		"magnet",
	]);
	k.play("life");

	magnet.onCollide("ground", () => {
		k.play("drop");
		k.wait(1, () => k.destroy(magnet));
	});

	magnet.onCollide("eat-area", () => {
		k.play("life-increase");
		k.destroy(magnet);
		onCatch?.();
	});

	return magnet;
}
