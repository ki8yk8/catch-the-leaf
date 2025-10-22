import kaplay from "kaplay";
import { registerGameplayScene } from "./scenes/gameplay";

const k = kaplay({
	background: "#fdfffc",
});

k.loadRoot("./");

if (process.env.NODE_ENV === "development") {
	k.debug.inspect = true;
} else {
	k.debug.inspect = false;
}

k.setGravity(400);

registerGameplayScene(k);

k.go("gameplay")