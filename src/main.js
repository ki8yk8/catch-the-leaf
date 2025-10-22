import kaplay from "kaplay";
import { spawn_leaf } from "./objects/leaf";

const k = kaplay({
	background: "#fdfffc",
});

k.loadRoot("./");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

const PLAYER_INITIAL_SPEED = 1000;
const ACCELERATON_G = 100; // in pixels per second square
const ACCElERATION_BASKET = 1200;
const LEAF_INTERVAL = 1; // in seconds
const GROUND_HEIGHT = 40;

const key_register = {
	left: null,
	right: null,
};

const ground = k.add([
	k.rect(k.width(), GROUND_HEIGHT),
	k.pos(k.width() / 2, k.height()),
	k.color("#011627"),
	k.anchor("bot"),
	k.area(),
	k.body({ isStatic: true }),
	"ground",
]);

// creating basket and registering the handle buttons
const basket = k.add([
	k.rect(100, 80),
	k.pos(k.width() / 2, k.height()-GROUND_HEIGHT-2),
	k.color("#7765e3"),
	k.anchor("bot"),
	k.area(),
	k.body({isStatic: true}),
	"basket",
]);
basket.add([
	k.rect(basket.width, basket.height*0.2),
	k.pos(0, -basket.height),
	k.anchor("top"),
	k.area(),
	"eat-area"
])

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

// spawn a leaf every 2 seconds
k.loop(LEAF_INTERVAL, () => {
	spawn_leaf(k);
});

// at every frame
k.onUpdate(() => {
	const now = Date.now();

	for (const leaf of k.get("leaf--falling")) {
		// gravity logic here
		leaf.move(
			0,
			0.5 * ACCELERATON_G * Math.pow((now - leaf.start_time) / 1000, 2)
		);
	}
});
