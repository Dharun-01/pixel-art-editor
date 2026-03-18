export default function Footer() {
	return (
		<>
			<div className='h-48 w-full flex flex-col justify-end p-10 text-home-muted bg-home-bg'>
				<p>Pixel Art Editor</p>
				<p>Built for the curious. Made for the creative.</p>©
				{new Date().getFullYear()} — Made with pixels and stubbornness.
			</div>
		</>
	);
}
