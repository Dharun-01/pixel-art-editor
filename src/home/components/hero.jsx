import Table from './Table';

export default function Hero() {
	return (
		<>
			<div className='bg-home-bg w-screen flex flex-col gap-y-16'>
				<div className=' flex flex-col pointer-events-none select-none gap-y-5 justify-center items-center w-[90%] mx-auto'>
					<p className='text-6xl text-wrap tracking-wider leading-tight mt-20 text-left pl-15 text-home-text'>
						Welcome, where imagination finds its pixels.
					</p>
					<p className=' text-xl text-wrap text-home-muted pl-30'>
						- Every great artwork started with a blank canvas and someone brave
						enough to pick up a brush. Yours starts here.
					</p>
				</div>
				<Table />
			</div>
		</>
	);
}
