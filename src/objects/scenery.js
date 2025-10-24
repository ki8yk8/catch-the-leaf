import { Butterfly } from "./butterfly";

const COLORS = {
	morning_sky: "#5CB3F8",
	dark_night: "#0e1f4b",
};

const LEVEL_COLOR = ["morning_sky", "dark_night"];

export function Scenery({ k, ground_height, padding, level = 12 }) {
	const scenery_rect = k.add([
		k.rect(k.width() - padding * 2, k.height() - ground_height),
		k.color(COLORS[LEVEL_COLOR[Math.floor(level / 4) % 2]]),
		k.pos(padding, 0),
	]);

	// add sun
	const sun = scenery_rect.add([
		k.sprite("sun"),
		k.pos((scenery_rect.width * 1) / 6, scenery_rect.height * 0.2),
		k.anchor("center"),
		k.scale(1),
	]);

	// add clouds with parallax effect farther it is controlled by scale the slower it moves
	// position is defined as [x, y, z] z is between 0 and 1. 0 is very close and 1 is infinite
	[
		[150, 150, 0.2],
		[350, 200, 0.65],
		[500, 100, 0.8],
		[700, 220, 0.4],
	].forEach((pos) => {
		const cloud = scenery_rect.add([
			k.sprite("cloud"),
			k.pos(pos[0], pos[1]),
			k.anchor("center"),
			k.scale(k.clamp(1 - pos[2], 0.6, 1.2)),
		]);

		k.onUpdate(() => {
			// move the cloud from left to right
			const t = k.time();

			// if cloud goes over the left side; then it should appear from the right side
			if (cloud.pos.x < padding - cloud.width / 2) {
				cloud.pos.x = k.width() - padding * 2 + cloud.width / 2;
				return;
			}

			cloud.move(-5 / (pos[2] + 0.0001), k.rand(1, 10) * Math.sin(t));
		});
	});

	k.onUpdate(() => {
		// scale sun
		const t = k.time();
		const s = 1 + 0.15 * Math.sin(t * 0.8);
		sun.scale = k.vec2(s);
	});

	// randomly a buttefly appears mmoving in sine pattern across the screen
	function spawn_butterfly_randomly() {
		Butterfly({ k });
		k.wait(k.rand(5, 30), spawn_butterfly_randomly);
	}
	spawn_butterfly_randomly();

	return scenery_rect;
}
