const LEAF_SIZE = 64;
const LEAF_GAP = 32;

export function registerStartScene({ k, padding }) {
	k.scene("startgame", () => {
		const bg_music = k.play("music", {
			loop: true,
			volume: 0.8,
		});

		const game_screen = k.add([
			k.rect(k.width() - 2 * padding, k.height()),
			k.anchor("topleft"),
			k.pos(padding, 0),
			k.color("#86DB3C"),
		]);

		// drawing moving cells of leaf
		const n_horizontal_leaf = Math.ceil(game_screen.width / LEAF_SIZE);
		const n_vertical_leaf = Math.ceil(game_screen.height / LEAF_SIZE);
		// spawning those leafs
		for (let i = 0; i < n_vertical_leaf; i++) {
			for (let j = 0; j < n_horizontal_leaf; j++) {
				const bgleaf = game_screen.add([
					k.sprite("leaf"),
					k.pos(
						i * LEAF_SIZE + i * LEAF_GAP + LEAF_SIZE / 2,
						j * LEAF_SIZE + j * LEAF_GAP + LEAF_SIZE / 2
					),
					"bgleaf",
					k.z(-1),
					k.scale(1),
					k.rotate(0),
					k.animate({ relative: true }),
					k.anchor("center"),
				]);

				bgleaf.animate("scale", [k.vec2(1), k.vec2(1.5), k.vec2(1)], {
					duration: 2,
					easing: k.easings.easeInOutQuad,
				});

				bgleaf.animate("angle", [k.rand(0, 45), k.rand(-45, 0)], {
					direction: "ping-pong",
					duration: 1.25,
					easing: k.easings.easeInOutQuad,
				});

				bgleaf.animate(
					"pos",
					[
						k.vec2(k.rand(-10, 10), k.rand(-10, 10)),
						k.vec2(0, 0),
						k.vec2(k.rand(-10, 10), k.rand(-10, 10)),
					],
					{
						duration: 1.5,
						direction: "ping-pong",
						easing: k.easings.easeInOutQuad,
					}
				);
			}
		}

		const logo = game_screen.add([
			k.sprite("logo"),
			k.pos(game_screen.width / 2, 150),
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

		// add the main menu things
		const hint_title = game_screen.add([
			k.text("Use arrow keys and enter to navigate", {
				size: 22,
			}),
			k.pos(game_screen.width / 2, 220 * 1.1 + 32),
			k.anchor("top"),
		]);

		// adding menu items\
		const start_btn = game_screen.add([
			k.rect((game_screen.width * 2) / 3, 48 + 16 * 2, {
				radius: 20,
			}),
			k.pos(game_screen.width / 2, hint_title.pos.y + 22 + 32),
			k.anchor("top"),
			k.color("#8A2AE0"),
			k.outline(8, k.Color.fromHex("#FED701")),
			k.scale(1.1),
			k.z(10),
		]);
		const start_btn_text = start_btn.add([
			k.text("Start Game", {
				size: 48,
				font: "atma-bold",
				align: "center",
			}),
			k.color("#ffffff"),
			k.anchor("center"),
			k.pos(0, start_btn.height / 2 + 4),
		]);

		const instructions_btn = game_screen.add([
			k.rect((game_screen.width * 2) / 3, 48 + 16 * 2, {
				radius: 20,
			}),
			k.pos(game_screen.width / 2, start_btn.pos.y + 80 + 8),
			k.anchor("top"),
			k.color("#8A2AE0"),
		]);
		const instructions_btn_text = instructions_btn.add([
			k.text("Instructions", {
				size: 48,
				font: "atma-bold",
				align: "center",
			}),
			k.color("#ffffff"),
			k.anchor("center"),
			k.pos(0, start_btn.height / 2 + 4),
		]);

		let sound = true;
		k.volume(sound ? 1 : 0);
		const sound_btn = game_screen.add([
			k.rect((game_screen.width * 2) / 3, 48 + 16 * 2, {
				radius: 20,
			}),
			k.pos(game_screen.width / 2, instructions_btn.pos.y + 80 + 8),
			k.anchor("top"),
			k.color("#8A2AE0"),
		]);
		const sound_btn_text = sound_btn.add([
			k.text(`Sound: ${sound ? "On" : "Off"}`, {
				size: 48,
				font: "atma-bold",
				align: "center",
			}),
			k.color("#ffffff"),
			k.anchor("center"),
			k.pos(0, start_btn.height / 2 + 4),
		]);

		const btns = [start_btn, instructions_btn, sound_btn];
		let active_btn = 0;
		k.onKeyPress("down", () => {
			if (active_btn >= btns.length - 1) return;

			// remove outline from previous
			btns[active_btn].use(k.outline(0, k.Color.fromHex("#86DB3C")));
			btns[active_btn].use(k.z(1));
			k.play("click");
			k.tween(1.1, 1, 0.15, (s) => btns[active_btn].use(k.scale(s)));
			k.wait(0.15, () => {
				active_btn++;
				btns[active_btn].use(k.outline(8, k.Color.fromHex("#FED701")));
				k.tween(1, 1.1, 0.25, (s) => btns[active_btn].use(k.scale(s)));
				btns[active_btn].use(k.z(10));
			});
		});
		k.onKeyPress("up", () => {
			if (active_btn === 0) return;

			// remove outline from previous
			btns[active_btn].use(k.outline(0, k.Color.fromHex("#86DB3C")));
			btns[active_btn].use(k.z(1));
			k.tween(1.1, 1, 0.15, (s) => btns[active_btn].use(k.scale(s)));
			k.play("click");
			k.wait(0.15, () => {
				active_btn--;
				btns[active_btn].use(k.outline(8, k.Color.fromHex("#FED701")));
				k.tween(1, 1.1, 0.25, (s) => btns[active_btn].use(k.scale(s)));
				btns[active_btn].use(k.z(10));
			});
		});

		// what happens when enter is clicked on top of button
		k.onKeyPress("enter", () => {
			if (active_btn === 0) {
				bg_music.stop();
				k.go("gameplay");
			} else if (active_btn === 1) {
				k.go("instructions");
			} else if (active_btn === 2) {
				sound = !sound;
				k.volume(sound ? 1 : 0);
				sound_btn_text.use(
					k.text(`Sound: ${sound ? "On" : "Off"}`, {
						size: 48,
						font: "atma-bold",
						align: "center",
					})
				);
			}
		});
	});
}
