const MAGNET_LASTS = 10;

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

	// just for handling the magnet attraction logic
	k.onUpdate(() => {
		const leaves = k.get("leaf--falling", { recursive: true });
		let basket = k.get("basket--magnetic");

		if (basket.length === 0) return;
		basket = basket[0];
		if (!basket.is("basket--magnetic")) return;

		const eatarea = basket.get("eat-area")[0];

		const [b, e] = [basket.pos, eatarea.pos];
		const p = [b.x - e.x, b.y + e.y];

		// for each leaf compute the distance between leaf and basket and move it toward each other
		leaves.forEach((leaf) => {
			if (leaf.is("leaf--on-ground")) return;

			const l = [leaf.pos.x, leaf.pos.y];
			const d = [l[0] - p[0], l[1] - p[1]];
			const dist = Math.sqrt(d[0] * d[0] + d[1] * d[1]);

			// closer means get stronger force
			const magenetic_strength = k.map(dist, 0, 700, 3.5, 1.8);

			leaf.move(d[0] * -1 * magenetic_strength, d[1] * -1 * magenetic_strength);
		});
	});

	return magnet;
}

// logic for magent
export function spawn_magnet({ k, basket, padding }) {
	Magnet({
		k,
		padding,
		onCatch: () => {
			const magnet_sound = k.play("whoosh", { loop: true });
			basket.tag("basket--magnetic");

			const magnet_progress_bar = k.add([
				k.rect(k.width() / 3, 48),
				k.pos(25 + padding, 75),
				k.color("#86bd3c"),
				k.anchor("topleft"),
				k.z(1),
			]);

			const width = k.width() / 3 - 8;

			const size_bars = width / 25;
			let n_bars = width / size_bars;

			const bars_loop = k.loop(MAGNET_LASTS / n_bars, () => {
				// destroying the old magnet bars
				magnet_progress_bar.get("magnet-bar").forEach((bar) => {
					k.destroy(bar);
				});

				for (let i = 0; i < n_bars; i++) {
					magnet_progress_bar.add([
						k.rect(size_bars - 2, 40),
						k.pos(4 + i * size_bars, 4),
						"magnet-bar",
					]);
				}
				n_bars--;
				if (n_bars === 0) {
					bars_loop.cancel();
				}
			});

			const magnet_text = k.add([
				k.text(`Magnet`, {
					size: 18,
				}),
				k.pos(25 + padding, 75 + 48 + 4),
				k.color("#fed702"),
			]);

			// remove text before stopping
			k.wait(MAGNET_LASTS - 1, () => k.destroy(magnet_text));

			k.wait(MAGNET_LASTS, () => {
				basket.untag("basket--magnetic");
				k.destroy(magnet_progress_bar);
				magnet_sound.stop();
			});
		},
	});
}
