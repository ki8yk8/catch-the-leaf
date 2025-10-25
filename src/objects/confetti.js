export function Confetti({ k, rotate = false, pos }) {
	const confetti = k.add([
		k.pos(pos[0], pos[1]),
		k.particles(
			{
				max: 100,
				speed: [100, 200],
				lifeTime: [5, 7],
				angle: [0, 360],
				opacities: [1.0, 0.0],
				colors: [k.rgb(255, 113, 141), k.rgb(168, 100, 253)],
			},
			{
				direction: rotate ? 315 : 225,
				spread: 60,
			}
		),
	]);

	return confetti;
}
