import { useEffect, useRef, useState } from 'react';

export default function useScrollReveal({ threshold = 0.2, once = true } = {}) {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;

		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					if (once) observer.disconnect();
				}
			},
			{ threshold },
		);

		observer.observe(el);

		return () => observer.disconnect();
	}, [once, threshold]);

	return { ref, isVisible };
}
