import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Table() {
	const [isZooming, setIsZooming] = useState(false);
	const [artBookHovered, setArtBookHovered] = useState(false);
	const artbookControls = useAnimation();
	const pageControls = useAnimation();

	async function handleArtbookClick() {
		setIsZooming(true);

		// ── phase 1: artbook lifts up ──────────────────────────────
		await artbookControls.start({
			scale: 1.1,
			y: -20,
			transition: { duration: 0.2 },
		});

		// ── phase 2: whole page zooms into artbook ─────────────────
		await pageControls.start({
			scale: 8,
			opacity: 0,
			transition: { duration: 0.7, ease: 'easeInOut' },
		});

		// ── phase 3: navigate to editor ────────────────────────────
		window.location.href = './editor.html';
	}

	return (
		<motion.div
			animate={pageControls}
			className='bg-home-bg flex pt-5 items-center z-10 
                       justify-center overflow-hidden'
			style={{ perspective: '1200px' }}
		>
			{/* ── Table ─────────────────────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				className='relative w-[700px] h-[420px] rounded-2xl  shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden border-t border-white/10'
				style={{
					background: 'linear-gradient(160deg, #3d1f11 0%, #1a0f0a 100%)',
					rotateX: '15deg',
					transformStyle: 'preserve-3d',
				}}
			>
				{/* Layer 1: The Wood Grain Texture (Subtle Noise) */}
				<div
					className='absolute inset-0 opacity-20 pointer-events-none'
					style={{
						backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`,
					}}
				></div>

				{/* Layer 2: The "Glitter" / Polished Specular Highlight */}
				<div className='absolute wood-glitter inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 pointer-events-none'></div>

				{/* Layer 3: The Edge Lighting (Makes it look thick) */}
				<div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent'></div>

				{/* table surface shine */}
				<div
					className='absolute inset-0 rounded-2xl opacity-20'
					style={{
						background:
							'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
					}}
				/>

				{/* ── Art Book ──────────────────────────────────── */}
				<motion.div
					animate={artbookControls}
					onHoverStart={() => setArtBookHovered(true)}
					onHoverEnd={() => setArtBookHovered(false)}
					whileHover={{
						scale: 1.06,
						rotateZ: 1,
						y: -8,
						transition: { duration: 0.2 },
					}}
					onClick={handleArtbookClick}
					className='absolute left-[60px] top-[60px] w-[160px] 
                               h-[210px] rounded-sm cursor-pointer shadow-xl'
					style={{
						background: 'linear-gradient(135deg, #1a237e, #283593)',
						transformStyle: 'preserve-3d',
					}}
				>
					{/* book spine */}
					<div
						className='absolute left-0 top-0 bottom-0 w-4 
                                    bg-black/30 rounded-l-sm'
					/>
					{/* book title */}
					<div
						className='flex flex-col items-center justify-center 
                                    h-full gap-2 px-4'
					>
						<div
							className='w-12 h-12 border-2 border-white/60 
                                        rounded-sm grid grid-cols-2 gap-0.5 p-1'
						>
							<div className='bg-blue-400 rounded-[1px]' />
							<div className='bg-red-400 rounded-[1px]' />
							<div className='bg-green-400 rounded-[1px]' />
							<div className='bg-yellow-400 rounded-[1px]' />
						</div>
						<p
							className='text-white text-xs font-bold text-center 
                                      leading-tight'
						>
							PIXEL ART
						</p>
						<p className='text-white/70 text-[18px]  animate-bounce text-center'>
							Click to start
						</p>
					</div>

					{/* art book tooltip */}
					<motion.div
						initial={{ opacity: 0, y: 6 }}
						animate={
							artBookHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
						}
						transition={{ duration: 0.2 }}
						className='absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none'
					>
						<span
							className='bg-black/80 text-[#F5ECD7] text-xs px-3 py-1.5 rounded-full border border-white/10'
							style={{ fontFamily: "'DM Sans', sans-serif" }}
						>
							Open your canvas →
						</span>
					</motion.div>
				</motion.div>

				{/* ── Pencils ───────────────────────────────────── */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					whileHover={{ rotate: -8, scale: 1.1 }}
					className='absolute left-[260px] top-[120px] 
                               cursor-pointer flex flex-row gap-1'
					onClick={() => (window.location.href = './editor.html')}
				>
					{['#F4D03F', '#E74C3C', '#3498DB'].map((color, i) => (
						<div
							key={i}
							className='w-4 h-28 rounded-full shadow-md'
							style={{
								background: color,
								transform: `rotate(${i * 4 - 4}deg) 
                                            translateX(${i * 6}px)`,
							}}
						/>
					))}
				</motion.div>

				{/* ── Eraser ────────────────────────────────────── */}
				<motion.div
					whileHover={{ scale: 1.1, rotate: 3 }}
					className='absolute right-[100px] top-[200px] w-16 h-8 
                            rounded-sm shadow-lg cursor-pointer'
					animate={{ rotateZ: 90 }}
					style={{ background: '#fff' }}
					onClick={() => (window.location.href = './editor.html')}
				>
					<div className='w-full h-3 bg-gray-600 rounded-t-sm' />
				</motion.div>

				{/* ── Paint palette ─────────────────────────────── */}
				<motion.div
					whileHover={{ scale: 1.08, rotate: -3 }}
					className='absolute right-[80px] top-[60px] w-24 h-16 
                               rounded-full shadow-lg cursor-pointer
                               bg-white/90 flex flex-wrap gap-1 p-3'
					onClick={() => (window.location.href = './editor.html')}
				>
					{[
						'#E74C3C',
						'#3498DB',
						'#2ECC71',
						'#F39C12',
						'#9B59B6',
						'#1ABC9C',
					].map((c, i) => (
						<div
							key={i}
							className='w-3 h-3 rounded-full'
							style={{ background: c }}
						/>
					))}
				</motion.div>
			</motion.div>

			{/* ── Bottom tagline ────────────────────────────────── */}
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.6 }}
				className='absolute bottom-12 text-white/90 text-md font-screen  
                           tracking-widest'
			>
				Click the art book to start drawing!
			</motion.p>

			{/* ── Zoom overlay (white flash on navigate) ────────── */}
			{isZooming && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.3 }}
					className='fixed inset-0 bg-white z-50 pointer-events-none'
				/>
			)}
		</motion.div>
	);
}
