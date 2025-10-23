export function get_heart_string(lifes) {
	if (lifes <= 3) {
		return Array(lifes).fill("♥").join("");
	} else {
		return `♥x${lifes}`;
	}
}
