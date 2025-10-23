export function Butterfly({ k }) {
	const random_ht = k.rand(100, k.height() - 150);
	const speed = k.rand(40, 90);
	const flip = Math.random() < 0.5;

	// ltr when flip = false else rtl
	const [start_x, end_x] = flip ? [50, 650] : [620, -80];

	const butterfly = k.add([
		k.sprite("butterfly"),
		k.pos(start_x, random_ht),
		k.anchor("center"),
		k.scale(0.8),
	]);

	k.onUpdate(() => {
		if (!butterfly.exists()) return;

		butterfly.move(flip ? speed : -speed, Math.sin(k.time() * 1) * 100);
		if ((flip && butterfly.pos.x > end_x) || (!flip && butterfly.pos < end_x)) {
			k.destroy(butterfly);
		}
	});

	return Butterfly;
}
