export function registerStartScene({ k, padding }) {
	k.scene("startgame", () => {
		const game_screen = k.add([
			k.rect(k.width() - 2 * padding, k.height()),
			k.anchor("topleft"),
			k.pos(padding, 0),
			k.color("#86DB3C"),
		]);

		const logo = game_screen.add([
			k.sprite("logo"),
			k.pos(game_screen.width / 2, 100),
			k.anchor("center"),
			k.scale(1),
			k.rotate(0),
			k.animate({ relative: true }),
		]);

		// animating the logo
		// a hint of scaling
		logo.animate("scale", [k.vec2(1), k.vec2(1.1), k.vec2(1)], {
			duration: 3,
			easing: k.easings.easeInOutQuad,
		});

		// a pinch of rotation
		logo.animate("angle", [4, -4], {
			direction: "ping-pong",
			duration: 1.5,
			easing: k.easings.easeInOutQuad,
		});

		// and some wooble in y axis
		logo.animate("pos", [k.vec2(-10, 10), k.vec2(0, 0), k.vec2(10, 10)], {
			duration: 1.5,
			direction: "ping-pong",
			easing: k.easings.easeInOutQuad,
		});
	});
}
