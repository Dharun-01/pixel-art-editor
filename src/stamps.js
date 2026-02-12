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

		// === PARAMETERS ===

		// Paper texture (fine grain)
		const fineGrainSize = 1.5; // Microscopic paper fibers
		const mediumGrainSize = 3.5; // Larger paper texture
		const coarseGrainSize = 7; // Overall paper roughness

		// Graphite properties
		const baseOpacity = 0.65; // Natural graphite darkness
		const maxOpacity = 0.85; // Darkest graphite can get
		const minOpacity = 0.1; // Lightest visible graphite

		// Stroke direction (random for this stamp instance)
		const strokeAngle = Math.random() * Math.PI * 2;
		const strokeCos = Math.cos(strokeAngle);
		const strokeSin = Math.sin(strokeAngle);

		// Pressure center (where you're pressing hardest)
		const pressureCenterX = (Math.random() - 0.5) * radius * 0.3;
		const pressureCenterY = (Math.random() - 0.5) * radius * 0.3;

		// === NOISE FUNCTIONS ===

		// Deterministic pseudo-random function
		const hash = (x, y, seed = 0) => {
			const h = ((x * 374761393) ^ (y * 668265263) ^ (seed * 1911520717)) >>> 0;
			return (Math.abs(Math.sin(h)) * 43758.5453) % 1;
		};

		// Smooth interpolated noise
		const smoothNoise = (x, y, scale, seed = 0) => {
			const xScaled = x / scale;
			const yScaled = y / scale;

			const x0 = Math.floor(xScaled);
			const y0 = Math.floor(yScaled);
			const x1 = x0 + 1;
			const y1 = y0 + 1;

			const fx = xScaled - x0;
			const fy = yScaled - y0;

			// Smooth interpolation (smoothstep)
			const sx = fx * fx * (3 - 2 * fx);
			const sy = fy * fy * (3 - 2 * fy);

			// Get corner values
			const n00 = hash(x0, y0, seed);
			const n10 = hash(x1, y0, seed);
			const n01 = hash(x0, y1, seed);
			const n11 = hash(x1, y1, seed);

			// Bilinear interpolation
			const nx0 = n00 * (1 - sx) + n10 * sx;
			const nx1 = n01 * (1 - sx) + n11 * sx;

			return nx0 * (1 - sy) + nx1 * sy;
		};

		// === STAMP GENERATION ===

		for (let dy = -radius; dy <= radius; dy++) {
			for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Skip if outside pencil mark
				if (distance > radius) continue;

				// === 1. PRESSURE SIMULATION ===

				const pressureDist = Math.sqrt(
					(dx - pressureCenterX) ** 2 + (dy - pressureCenterY) ** 2,
				);

				// Pressure is highest at center, falls off with distance
				const rawPressure = 1.0 - pressureDist / radius;
				// Non-linear pressure (more realistic)
				const pressure = Math.pow(rawPressure, 0.7) * 0.9 + 0.1;

				// === 2. MULTI-SCALE PAPER TEXTURE ===

				// Fine grain (paper fibers)
				const fineNoise = smoothNoise(dx, dy, fineGrainSize, 1);

				// Medium grain (paper tooth)
				const mediumNoise = smoothNoise(dx, dy, mediumGrainSize, 2);

				// Coarse grain (overall paper roughness)
				const coarseNoise = smoothNoise(dx, dy, coarseGrainSize, 3);

				// Combine scales (weighted)
				const paperTexture =
					fineNoise * 0.5 + // 50% fine detail
					mediumNoise * 0.3 + // 30% medium texture
					coarseNoise * 0.2; // 20% large variation

				// === 3. DIRECTIONAL STRIATIONS ===

				// Project position onto stroke direction
				const alongStroke = dx * strokeCos + dy * strokeSin;
				const perpStroke = -dx * strokeSin + dy * strokeCos;

				// Pencil creates parallel micro-grooves
				const striationNoise = smoothNoise(
					perpStroke,
					alongStroke * 0.3,
					2.5,
					4,
				);

				// Directional emphasis
				const directionalFactor = 0.8 + striationNoise * 0.4;

				// === 4. GRAPHITE PARTICLE SIMULATION ===

				// Individual graphite particles (very fine)
				const particleNoise = hash(Math.floor(dx * 2), Math.floor(dy * 2), 5);

				// Some areas have denser particle clusters
				const clusterNoise = smoothNoise(dx, dy, 4, 6);
				const particleDensity = 0.7 + clusterNoise * 0.3;

				// === 5. DEPOSITION PROBABILITY ===

				// Does graphite deposit at this point?
				// Depends on: paper height, pressure, particle presence

				// Paper "height" (peaks get graphite, valleys don't)
				const paperHeight = paperTexture;

				// Higher pressure = graphite reaches lower valleys
				const heightThreshold = 0.3 - pressure * 0.25;

				// Must pass paper height test
				if (paperHeight < heightThreshold) continue;

				// Must have graphite particle present
				if (particleNoise > particleDensity) continue;

				// === 6. OPACITY CALCULATION ===

				// Base opacity from paper height and pressure
				let opacity = (paperHeight - heightThreshold) * pressure;

				// Apply directional factor
				opacity *= directionalFactor;

				// Particle contribution (some particles darker)
				const particleVariation = 0.85 + particleNoise * 0.3;
				opacity *= particleVariation;

				// === 7. RADIAL FALLOFF ===

				// Pencil mark is darkest in center, lighter at edges
				const radialFalloff = 1.0 - Math.pow(distance / radius, 1.5) * 0.4;
				opacity *= radialFalloff;

				// === 8. SOFT EDGES ===

				// Very gradual edge softening (pencil doesn't have hard edges)
				if (distance > radius * 0.75) {
					const edgeZone = (distance - radius * 0.75) / (radius * 0.25);
					const edgeFade = 1.0 - Math.pow(edgeZone, 1.5);
					opacity *= edgeFade;
				}

				// === 9. GRAPHITE SHEEN VARIATION ===

				// Some graphite particles catch light differently
				const sheenNoise = hash(Math.floor(dx * 1.5), Math.floor(dy * 1.5), 7);

				if (sheenNoise > 0.9) {
					// Slightly lighter (reflective particle)
					opacity *= 0.85;
				} else if (sheenNoise < 0.1) {
					// Slightly darker (matte particle)
					opacity *= 1.15;
				}

				// === 10. FINAL OPACITY CLAMPING ===

				// Scale to realistic graphite range
				opacity = opacity * baseOpacity;

				// Clamp to valid range
				opacity = Math.max(minOpacity, Math.min(maxOpacity, opacity));

				// Only include visible pixels
				if (opacity > 0.12) {
					stamp.push({
						dx: Math.round(dx),
						dy: Math.round(dy),
						opacity: opacity,
					});
				}
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
