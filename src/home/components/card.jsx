export default function Card(props) {
	return (
		<>
			<div className=' max-w-72 p-3 space-y-2 rounded-md z-50 bg-blue-800 backdrop-blur-2xl hover:scale-105 transition-transform ring ring-custom-blue'>
				<h3 className='text-2xl text-shadow-home-caption'>{props.title}</h3>
				<div className='text-wrap text-lg text-blue-100'>{props.body}</div>
			</div>
		</>
	);
}
