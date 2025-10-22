import kaplay from "kaplay";

const k = kaplay();

k.loadRoot("./");

const PLAYER_SPEED = 400;
const ACCELERATON_G = 100; // in pixels per second square
const LEAF_INTERVAL = 1; // in seconds
const GROUND_HEIGHT = 20;

const ground = k.add([
	k.rect(k.width(), GROUND_HEIGHT),
	k.pos(k.width() / 2, k.height()),
	k.anchor("bot"),
	k.area(),
	k.body({ isStatic: true }),
	"ground",
]);

// creating basket and registering the handle buttons
const basket = k.add([
	k.rect(100, 80),
	k.pos(k.width() / 2, k.height()),
	k.anchor("bot"),
]);

k.onUpdate(() => {
	// check if there was a key movement
	if (k.isKeyDown("left")) basket.move(-1 * PLAYER_SPEED, 0);
	if (k.isKeyDown("right")) basket.move(PLAYER_SPEED, 0);

	// clamping logic here
	const [b_x, b_y] = [k.width(), k.height()]; // boundary
	const [p_x, p_y] = [basket.pos.x, basket.pos.y]; // basket

	basket.pos.x = k.clamp(p_x, basket.width / 2, b_x - basket.width / 2);
});

function leaf_component() {
	const start = Date.now();

	return {
		id: "leaf",
		start_time: start,
	};
}

// randomly spawn leaf at the top
function spawn_leaf(size = [25, 25]) {
	const leaf = k.add([
		k.rect(...size),
		k.pos(k.rand(0, k.width()), 0), // randomly spawn from the top position
		k.area(), // for collision
		k.body(), // for gravity
		leaf_component(),
		"leaf",
		"leaf--falling",
	]);

	k.debug.log(`Leaf spawned at ${leaf.pos.x} ${leaf.pos.y}`);
	leaf.onCollide("ground", () => {
		leaf.unuse("leaf--falling");
		leaf.use("leaf--on-ground");
	});
}

// spawn a leaf every 2 seconds
k.loop(LEAF_INTERVAL, () => {
	spawn_leaf();
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

k.debug.log(`Screen width and height = (${k.width()}, ${k.height()})`);
