import kaplay from "kaplay";

const k = kaplay();

k.loadRoot("./");

const PLAYER_SPEED = 400;

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

k.debug.log(`Screen width and height = (${k.width()}, ${k.height()})`);
