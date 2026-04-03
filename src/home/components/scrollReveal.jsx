import useScrollReveal from '../hooks/useScrollReveal';

export default function ScrollReveal({
	children,
	delay = 0,
	direction = 'up',
}) {
	const { ref, isVisible } = useScrollReveal();

	const baseStyle = {
		transform: isVisible
			? 'translate(0, 0)'
			: direction === 'up'
				? 'translate(0, 30px)'
				: direction === 'left'
					? 'translate(30px, 0)'
					: direction === 'right'
						? 'translate(-30px, 0)'
						: 'translate(0, -30px)',
		opacity: isVisible ? 1 : 0,
		transition: `transform 0.55s ease-out ${delay}ms, opacity 0.55s ease-out ${delay}ms`,
	};

	return (
		<>
			<div ref={ref} style={baseStyle}>
				{children}
			</div>
		</>
	);
}
