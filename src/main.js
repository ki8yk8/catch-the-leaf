import kaplay from "kaplay";

const k = kaplay({
	background: "#d46eb3",
});

k.loadRoot("./");

// working with objects
const basket = k.add([
	k.rect(32, 32),
	k.pos(10, 20),
	k.area(),
	k.body(),
	"shape",
]);
k.setGravity(10);
k.onKeyDown("right", () => {
	// basket.move(200, 0);
	basket.jump();
});

// working with scenes
// k.loadBean();
// k.scene("scenename", () => {
// 	k.add([k.sprite("bean"), k.color(k.RED)]);
// 	k.onKeyPress(() => {
// 		k.go("bluebean");
// 	});
// });

// k.scene("bluebean", () => {
// 	k.add([k.sprite("bean"), k.color(k.BLUE)]);
// });

// k.go("scenename");
