export function Scenery({ k, ground_height }) {
	const scenery_rect = k.add([
		k.rect(k.width(), k.height() - ground_height),
		k.pos(0, 0),
	]);

	// add sun
	const sun = scenery_rect.add([
		k.sprite("sun"),
		k.pos((k.width() * 1) / 6, k.height() * 0.2),
		k.anchor("center"),
		k.scale(1),
	]);

	// add clouds with parallax effect farther it is controlled by scale the slower it moves
	// position is defined as [x, y, z] z is between 0 and 1. 0 is very close and 1 is infinite
	[
		[150, 150, 0],
		[350, 200, 0.4],
		[500, 100, 0.8],
	].forEach((pos) => {
		const cloud = scenery_rect.add([
			k.sprite("cloud"),
			k.pos(pos[0], pos[1]),
			k.anchor("center"),
		]);

		k.onUpdate(() => {
			// move the cloud from left to right
			const t = k.time();

			// if cloud goes over the left side; then it should appear from the right side
			if (cloud.pos.x < -cloud.width / 2) {
				cloud.pos.x = 600 + cloud.width;
				return;
			}

			cloud.move(-40, k.rand(2, 7) * Math.sin(t));
		});
	});

	k.onUpdate(() => {
		// scale sun
		const t = k.time();
		const s = 1 + 0.15 * Math.sin(t * 0.8);
		sun.scale = k.vec2(s);
	});

	return scenery_rect;
}
