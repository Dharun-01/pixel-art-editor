export default function Card(props) {
	return (
		<>
			<div className=' max-w-72 p-3 space-y-2 rounded-md z-50 bg-blue-950 backdrop-blur-2xl hover:scale-105 transition-transform ring ring-custom-blue hover:shadow-md hover:shadow-blue-500/50'>
				<h3 className='text-2xl text-blue-100'>{props.title}</h3>
				<div className='text-wrap text-md text-blue-200'>{props.body}</div>
			</div>
		</>
	);
}
