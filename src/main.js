import kaplay from "kaplay";

const k = kaplay({});

k.loadRoot("./");

// creating basket and registering the handle buttons
const basket = k.add([
	k.rect(100, 80),
	k.pos(k.width() / 2, k.height()),
	k.anchor("bot"),
]);

basket.onKeyDown("left", () => {
	basket.move(-400, 0);
});
basket.onKeyDown("right", () => {
	k.debug.log(k.pos)
	basket.move(400, 0);
});

k.debug.log(`Screen width and height = (${k.width()}, ${k.height()})`);
