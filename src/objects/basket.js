const PLAYER_INITIAL_SPEED = 1000;
const ACCElERATION_BASKET = 1200;

export function Basket({ k, ground_height }) {
	const key_register = {
		left: null,
		right: null,
	};

	const basket = k.add([
		k.rect(100, 80),
		k.pos(k.width() / 2, k.height() - ground_height - 2),
		k.color("#7765e3"),
		k.anchor("bot"),
		k.area(),
		k.body({ isStatic: true }),
		"basket",
	]);

	basket.add([
		k.rect(basket.width, basket.height * 0.2),
		k.pos(0, -basket.height),
		k.anchor("top"),
		k.area(),
		"eat-area",
	]);

	k.onUpdate(() => {
		// check if there was a key movement
		if (k.isKeyDown("left")) {
			if (!key_register["left"]) {
				key_register["left"] = Date.now();
			} else {
				const t = (Date.now() - key_register["left"]) / 1000;
				basket.move(
					-1 *
						(PLAYER_INITIAL_SPEED * t +
							0.5 * ACCElERATION_BASKET * Math.pow(t, 2)),
					0
				);
			}
		}
		if (k.isKeyReleased("left")) {
			key_register["left"] = null;
		}

		if (k.isKeyDown("right")) {
			if (!key_register["right"]) {
				key_register["right"] = Date.now();
			} else {
				const t = (Date.now() - key_register["right"]) / 1000;

				basket.move(
					PLAYER_INITIAL_SPEED * t + 0.5 * ACCElERATION_BASKET * Math.pow(t, 2),
					0
				);
			}
		}
		if (k.isKeyReleased("right")) {
			key_register["right"] = null;
		}

		// clamping logic here
		const [b_x, b_y] = [k.width(), k.height()]; // boundary
		const [p_x, p_y] = [basket.pos.x, basket.pos.y]; // basket

		basket.pos.x = k.clamp(p_x, basket.width / 2, b_x - basket.width / 2);
	});

	return basket;
}
