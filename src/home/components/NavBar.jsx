export default function NavBar() {
	function handleLogoClick() {
		window.location.href = '/';
	}
	return (
		<>
			<div className='bg-home-bg pt-5 z-50 w-[80%] flex flex-row h-24 rounded-full backdrop-blur-lg '>
				<img
					src='../../../assets/editor_logo_dark_mode.png'
					className='w-40 h-16 cursor-pointer top-5 left-5 absolute rounded-md'
					onClick={handleLogoClick}
					alt='Pixel Art'
				/>
			</div>
		</>
	);
}
