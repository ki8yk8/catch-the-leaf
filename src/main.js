import kaplay from "kaplay";
import { registerGameplayScene } from "./scenes/gameplay";
import { registerStartScene } from "./scenes/start-game";
import { registerGameOverScene } from "./scenes/gameover";

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
registerStartScene(k);
registerGameOverScene(k);

k.go("gameover", 10);
