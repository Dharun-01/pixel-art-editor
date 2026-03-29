import { useAnimation } from 'framer-motion';
import { getAssetPath } from '../../utils';

import Card from './card';
export default function MiddleSection() {
	const buttonControls = useAnimation();

	function handleStartDrawing() {
		buttonControls.start({
			scale: 1.1,
			y: -20,
			transition: { duration: 0.2 },
		});

		window.location.href = './editor.html';
	}

	return (
		<>
			<div className='w-full bg-home-bg pt-20 pl-25'>
				<div className='flex flex-col gap-y-5'>
					<h1
						className='text-6xl font-medium p-5'
						style={{
							backgroundImage: 'linear-gradient(to right, #4da3ff, #6fb7ff)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Features
					</h1>
					<div className='flex flex-row flex-wrap gap-x-10 gap-y-10 mt-5'>
						<Card
							title='The essentials, perfected.'
							body="Pencil, brush, fill, eraser — every tool
you've ever needed, tuned for pixel-perfect 
precision. From single-pixel lines to broad 
strokes, your hand translates exactly to the canvas."
						/>
						<Card
							title='Your palette, your identity.'
							body='Mix any color imaginable with the built-in 
HSV color picker. Save your favorite shades, 
switch between primary and secondary colors 
instantly — the right color is always one click away.'
						/>
						<Card
							title='Symmetry without the math.'
							body='Reflect across vertical, horizontal, diagonal 
axes — or all at once. Perfect for characters, icons, 
and patterns. What you draw on one side, the canvas 
mirrors on the other.'
						/>
						<Card
							title='Beyond the freehand.'
							body=" Lines, rectangles, circles, polygons, stars, 
hearts — fourteen shapes ready to drop onto your 
canvas. Combine them with your brushes for artwork 
that's structured yet personal."
						/>

						<Card
							title='See every pixel.'
							body='Zoom from 1x to 1000x. Toggle the grid to 
snap your work into perfect alignment. At this level 
of precision, every single pixel is a deliberate 
creative decision.'
						/>

						<Card
							title='Your work, always safe.'
							body=' Every stroke is saved automatically. Close the 
tab, refresh the page, lose power — when you return, 
your canvas is exactly where you left it. No save 
button anxiety.'
						/>
					</div>
				</div>

				<div className='flex flex-col gap-x-5 gap-y-5 py-10'>
					<h1
						className='text-6xl p-5 font-medium'
						style={{
							backgroundImage: 'linear-gradient(to right, #4da3ff, #6fb7ff)',
							WebkitBackgroundClip: 'text',
							webkitTextFillColor: 'transparent',
						}}
					>
						What people are making
					</h1>
					<div className='flex flex-row flex-wrap gap-x-10 gap-y-10 mt-5'>
						<div className='flex flex-col flex-wrap hover:scale-105 transition-transform gap-x-10 justify-center items-center mt-5  max-w-72 p-3 space-y-2 rounded-md z-50 bg-blue-950 hover:shadow-md hover:shadow-blue-500/50 backdrop-blur-2xl ring ring-custom-blue'>
							<img
								src={getAssetPath('/icons/MyPicture.png')}
								className='w-76 h-56 rounded-md'
							/>
							<p className='text-blue-200 text-lg'>
								{`"I don't know what this is... but it looks beautiful."`}
								<span className='font-semibold'> -Yogesh </span>
							</p>
						</div>
						<div className='flex flex-col hover:scale-105 transition-transform flex-wrap gap-x-10 justify-center items-center mt-5  max-w-72 p-3 space-y-2 rounded-md z-50 bg-blue-950 hover:shadow-md hover:shadow-blue-500/50 backdrop-blur-2xl ring ring-custom-blue'>
							<img
								src={getAssetPath('/icons/My Picture(2).png')}
								className='w-76 h-56 rounded-md'
							/>
							<p className='text-blue-200 text-lg'>
								{`"Had fun drawing these hearts."`}
								<span className='font-semibold'> -Anand </span>
							</p>
						</div>

						<div className='flex flex-col flex-wrap gap-x-10 justify-center hover:scale-105 transition-transform items-center mt-5 hover:shadow-md hover:shadow-blue-500/50 max-w-72 p-3 space-y-2 rounded-md z-50 bg-blue-950 backdrop-blur-2xl ring ring-custom-blue'>
							<img
								src={getAssetPath('/icons/Human.png')}
								className='w-76 h-56 rounded-md'
							/>
							<p className='text-blue-200 text-lg'>
								{`"Love the editor, it helps me think creatively."`}
								<span className='font-semibold'> -Peter </span>
							</p>
						</div>
					</div>
				</div>

				<div className='text-lg flex flex-col gap-y-5 text-home-muted'>
					<h1 className='text-6xl text-home-text font-terminal animate-pulse hover:animate-none hover:text-shadow-md hover:text-shadow-blue-500/50 transition-all duration-300 cursor-default'>
						Your canvas is one click away
					</h1>
					<p>
						<span className='font-semibold text-2xl text-blue-300 pr-3'>
							No account. No download. No setup.
						</span>
						Just you, the tools, and whatever you feel like making today.
					</p>
					<button
						onClick={handleStartDrawing}
						className='bg-blue-700  hover:bg-blue-600 px-2 py-2 w-[90%] text-nowrap rounded-md text-blue-100 hover:shadow-2xs hover:shadow-blue-500/50 transition-transform hover:scale-105'
					>
						Start drawing →
					</button>
				</div>
			</div>
		</>
	);
}
