export const STAMP = {
	pencil: (size) => {
		let stamp = [];
		const radius = size / 2;
		let opacity = 1.0;
		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.sqrt(dx ** 2 + dy ** 2);

				if (distance <= radius) {
					stamp.push({ dx: Math.round(dx), dy: Math.round(dy), opacity });
				}
			}
		}
		//console.log(stamp);
		return stamp;
	},

	circle: (size) => {
		let stamp = [];
		const radius = size / 2;
		let opacity;
		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.sqrt(dx ** 2 + dy ** 2);

				if (distance <= radius) {
					opacity = 1.0 - distance / radius;
					stamp.push({ dx: Math.round(dx), dy: Math.round(dy), opacity });
				}
			}
		}
		// console.log(stamp);
		return stamp;
	},

	calligraphyBrush: (size, angle = -45) => {
		const stamp = [];
		let opacity = 1.0;
		const length = size;
		const thickness = 0.5;

		// Convert angle to slope
		const angleRad = (angle * Math.PI) / 180;
		const slope = Math.tan(angleRad);

		const halfLength = length / 2;

		// Walk along the line from -halfLength to +halfLength
		for (let t = -halfLength; t <= halfLength; t += 0.5) {
			// Point on the center line
			let centerX = t;
			let centerY = slope * t;

			// Fade near ends
			const endFactor = Math.abs(t) / halfLength;

			if (endFactor > 0.8) {
				opacity = 1.0 - ((endFactor - 0.8) / 0.2) * 0.5;
			}
			// Add thickness perpendicular to the line
			// Perpendicular slope = -1/slope
			const perpSlope = slope === 0 ? Infinity : -1 / slope;

			// Direction perpendicular to line (normalized)
			const perpDx = 1 / Math.sqrt(1 + perpSlope * perpSlope);
			const perpDy = perpSlope / Math.sqrt(1 + perpSlope * perpSlope);

			// Add pixels across the thickness
			for (let w = -thickness / 2; w <= thickness / 2; w += 0.5) {
				const dx = Math.round(centerX + perpDx * w);
				const dy = Math.round(centerY + perpDy * w);

				// Avoid duplicates
				if (!stamp.some((p) => p.dx === dx && p.dy === dy)) {
					stamp.push({ dx, dy, opacity });
				}
			}
		}

		return stamp;
	},

	calligraphyPen: (size, angle = 45) => {
		const stamp = [];

		const length = size;
		const thickness = 0.5;

		// Convert angle to slope
		const angleRad = (angle * Math.PI) / 180;
		const slope = Math.tan(angleRad);

		const halfLength = length / 2;

		// Walk along the line from -halfLength to +halfLength
		for (let t = -halfLength; t <= halfLength; t += 0.5) {
			// Point on the center line
			let centerX = t;
			let centerY = slope * t;

			// Add thickness perpendicular to the line
			// Perpendicular slope = -1/slope
			const perpSlope = slope === 0 ? Infinity : -1 / slope;

			// Direction perpendicular to line (normalized)
			const perpDx = 1 / Math.sqrt(1 + perpSlope * perpSlope);
			const perpDy = perpSlope / Math.sqrt(1 + perpSlope * perpSlope);

			// Add pixels across the thickness
			for (let w = -thickness / 2; w <= thickness / 2; w += 0.5) {
				const dx = Math.round(centerX + perpDx * w);
				const dy = Math.round(centerY + perpDy * w);

				// Avoid duplicates
				if (!stamp.some((p) => p.dx === dx && p.dy === dy)) {
					stamp.push({ dx, dy, opacity: 1.0 });
				}
			}
		}

		return stamp;
	},

	airbrush: (
		size,
		density = 40, // particles per stamp
		flow = 0.05, // opacity per particle
		hardness = 0, // 0 = very soft, 1 = harder center
	) => {
		const stamp = [];
		const radius = size / 2;

		for (let i = 0; i < density; i++) {
			// Random point inside circle
			const r = Math.random() ** (1 - hardness) * radius;
			const theta = Math.random() * Math.PI * 2;

			const dx = Math.round(Math.cos(theta) * r);
			const dy = Math.round(Math.sin(theta) * r);

			// Falloff based on distance
			const distance = Math.sqrt(dx * dx + dy * dy);
			const opacity = flow * (1 - distance / radius);

			stamp.push({ dx, dy, opacity });
		}

		return stamp;
	},

	oilBrush: (size) => {
		const stamp = [];
		const radius = size / 2;

		// Create random bristle clusters
		const numClusters = Math.floor(size / 3) + 5;
		const clusters = [];

		for (let i = 0; i < numClusters; i++) {
			const angle =
				(i / numClusters) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
			const dist = Math.random() * radius * 0.5;

			clusters.push({
				x: Math.cos(angle) * dist,
				y: Math.sin(angle) * dist,
				strength: 0.6 + Math.random() * 0.4,
				radius: radius * 0.3 * (0.8 + Math.random() * 0.4),
			});
		}

		// Build the stamp
		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Skip if outside brush
				if (distance > radius) continue;

				let opacity = 0;

				// Accumulate from clusters
				for (const cluster of clusters) {
					const clusterDist = Math.sqrt(
						(dx - cluster.x) ** 2 + (dy - cluster.y) ** 2,
					);

					if (clusterDist < cluster.radius) {
						const influence =
							(1 - clusterDist / cluster.radius) * cluster.strength;
						opacity = Math.max(opacity, influence);
					}
				}

				// Overall radial falloff
				const falloff = 1.0 - Math.pow(distance / radius, 1.5);
				opacity *= falloff;

				// Add texture variation
				const texture = 0.85 + Math.random() * 0.3;
				opacity *= texture;

				// Only include visible pixels
				if (opacity > 0.15) {
					stamp.push({
						dx: Math.round(dx),
						dy: Math.round(dy),
						opacity: Math.max(0, Math.min(1, opacity)),
					});
				}
			}
		}

		return stamp;
	},
	crayon: (size) => {
		const stamp = [];
		const radius = size / 2;

		// Paper grain simulation
		const grainSize = 2 + Math.random() * 1.5; // Varied grain

		// Pressure simulation
		const pressureCenterX = (Math.random() - 0.5) * radius * 0.4;
		const pressureCenterY = (Math.random() - 0.5) * radius * 0.4;

		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance <= radius) {
					// Pressure calculation
					const pressureDist = Math.sqrt(
						(dx - pressureCenterX) ** 2 + (dy - pressureCenterY) ** 2,
					);
					const pressure = Math.max(0.3, 1.0 - pressureDist / radius);

					// Paper grain
					const grainX = Math.floor(dx / grainSize);
					const grainY = Math.floor(dy / grainSize);

					// Deterministic "random" based on position
					const grainSeed = ((grainX & 0xff) << 8) | (grainY & 0xff);
					const grainNoise =
						Math.abs(Math.sin(grainSeed * 12.9898) * 43758.5453) % 1;

					// Local variation within grain cell
					const localX = (dx % grainSize) / grainSize;
					const localY = (dy % grainSize) / grainSize;
					const localVar = Math.sin(localX * 3.14) * Math.sin(localY * 3.14);

					const adjustedNoise = grainNoise + localVar * 0.2;

					// Coverage threshold (varies with pressure)
					const coverageThreshold = 0.5 - pressure * 0.3;

					if (adjustedNoise > coverageThreshold) {
						// Base opacity from grain height
						let opacity = adjustedNoise * pressure;

						// Radial falloff
						const falloff = 1.0 - (distance / radius) * 0.3;
						opacity *= falloff;

						// Soft edges
						if (distance > radius * 0.85) {
							const edgeFade = (radius - distance) / (radius * 0.15);
							opacity *= edgeFade;
						}

						// Wax texture variation
						opacity *= 0.8 + Math.random() * 0.4;

						// Only include visible pixels
						if (opacity > 0.15) {
							stamp.push({
								dx: Math.round(dx),
								dy: Math.round(dy),
								opacity: Math.max(0.2, Math.min(0.95, opacity)),
							});
						}
					}
				}
			}
		}

		return stamp;
	},
	marker: (size) => {
		const stamp = [];
		const halfW = size / 2;
		const halfH = size * 0.35; // markers are flatter than tall
		const opacity = 0.3;
		for (let dy = -halfH; dy <= halfH; dy++) {
			for (let dx = -halfW; dx <= halfW; dx++) {
				// Normalized distances (0 → center, 1 → edge)
				const nx = Math.abs(dx) / halfW;
				const ny = Math.abs(dy) / halfH;

				// Hard rectangular cutoff
				if (nx > 1 || ny > 1) continue;

				// Edge pooling (ink gathers near edges)

				stamp.push({
					dx: Math.round(dx),
					dy: Math.round(dy),
					opacity: opacity,
				});
			}
		}

		return stamp;
	},

	naturalPencil: (size) => {
		const stamp = [];
		const radius = size / 2;

		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				// Slightly irregular radius (broken edge)
				const jitter = (Math.random() - 0.5) * 0.8;
				const dist = Math.sqrt(dx * dx + dy * dy) + jitter;

				if (dist > radius) continue;

				// Core pressure falloff
				let opacity = 1 - dist / radius;

				// Graphite grain (very important)
				opacity *= 0.35 + Math.random() * 0.45;

				// Random pixel drop (paper gaps)
				if (Math.random() < 0.15) continue;

				// Clamp
				opacity = Math.max(0.05, Math.min(0.6, opacity));

				stamp.push({
					dx: Math.round(dx),
					dy: Math.round(dy),
					opacity,
				});
			}
		}

		return stamp;
	},

	watercolorBrush: (size) => {
		const stamp = [];
		const radius = size / 2;

		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > radius) continue;

				// Very soft radial falloff
				let opacity = 1 - dist / radius;
				opacity = opacity ** 1.6;

				// Water turbulence (extremely important)
				opacity *= 0.2 + Math.random() * 0.5;

				// Pigment granulation (random clumping)
				if (Math.random() < 0.25) {
					opacity *= 0.25;
				}

				// Edge bloom (water pushes pigment outward)
				if (dist > radius * 0.75) {
					opacity += (dist / radius - 0.75) * 0.4;
				}

				// Clamp
				opacity = Math.max(0.02, Math.min(0.35, opacity));

				stamp.push({
					dx: Math.round(dx),
					dy: Math.round(dy),
					opacity,
				});
			}
		}

		return stamp;
	},
};
