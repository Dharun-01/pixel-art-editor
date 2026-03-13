export class colorSelectServices {
	static hsvToRgb(h, s, v) {
		s /= 100;
		v /= 100;
		const i = Math.floor(h / 60) % 6;
		const f = h / 60 - Math.floor(h / 60);
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);
		const [r, g, b] = [
			[v, t, p],
			[q, v, p],
			[p, v, t],
			[p, q, v],
			[t, p, v],
			[v, p, q],
		][i];
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	static validateInputValue(value, dispatch) {
		const trimmed = value.trim();

		if (trimmed === '' || trimmed === '#') {
			dispatch({
				type: 'SET_HEX_INPUT_ERROR',
				stringValue: 'Input cannot be empty',
			});
			return false;
		}

		if (!trimmed.startsWith('#')) {
			dispatch({
				type: 'SET_HEX_INPUT_ERROR',
				stringValue: '# symbol is missing',
			});
			return false;
		}

		if (!/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(trimmed)) {
			dispatch({
				type: 'SET_HEX_INPUT_ERROR',
				stringValue: 'Invalid hex format (e.g. #fff or #ff0000)',
			});
			return false;
		}

		dispatch({
			type: 'SET_HEX_INPUT_ERROR',
			stringValue: '',
		});

		return true;
	}
}
