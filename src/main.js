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

// randomly spawn leaf at the top
function spawn_leaf(size = [25, 25]) {
	const leaf = k.add([
		k.rect(...size),
		k.pos(k.rand(0, k.width()), 0), // randomly spawn from the top position
		k.area(), // for collision
		k.body(), // for gravity
		"leaf",
		"leaf--falling",
	]);
	const start_time = Date.now();

	k.debug.log(`Leaf spawned at ${leaf.pos.x} ${leaf.pos.y}`);

	// on each frame do this
	leaf.onUpdate(() => {
		// gravity logic here
		leaf.move(
			0,
			0.5 * ACCELERATON_G * Math.pow((Date.now() - start_time) / 1000, 2)
		);

		leaf.onCollide("ground", () => {
			k.destroy(leaf);
		});
	});
}

// spawn a leaf every 2 seconds
k.loop(LEAF_INTERVAL, () => {
	spawn_leaf();
});

k.debug.log(`Screen width and height = (${k.width()}, ${k.height()})`);
