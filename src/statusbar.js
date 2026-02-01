import { elt, iconDownloader } from './utils.js';
export class StatusBar {
	constructor(state) {
		this.pixelText = elt(
			'p',
			{ className: 'text-white text-[12px] w-24 h-5' },
			'',
		);
		this.pixelSvg = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'20px',
				'0 -960 960 960',
				'20px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'm312-397 85-107h169L312-712v315ZM537-96 399-391 240-192v-672l528 432H486l138 295-87 41ZM397-504Z',
			}),
		);
		this.pixelPosition = elt(
			'div',
			{
				className: 'flex flex-row w-40 justify-center gap-x-2 items-center',
			},
			this.pixelSvg,
			this.pixelText,
		);
		this.canvasSvg = elt(
			'svg',
			iconDownloader(
				'http://www.w3.org/2000/svg',
				'20px',
				'0 -960 960 960',
				'20px',
				'#e3e3e3',
			),
			elt('path', {
				d: 'M552-312h192v-192h-72v120H552v72ZM216-456h72v-120h120v-72H216v192Zm-48 264q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Zm0-72h624v-432H168v432Zm0 0v-432 432Z',
			}),
		);
		this.canvasSizeText = elt('p', { className: 'text-white text-[12px]' }, '');
		this.canvasSize = elt(
			'div',
			{ className: 'flex flex-row justify-center gap-x-2 items-center w-26' },
			this.canvasSvg,
			this.canvasSizeText,
		);
		this.leftStatus = elt(
			'div',
			{
				className: 'flex flex-row justify-left items-center w-100 h-5',
			},
			this.pixelPosition,
			this.canvasSize,
		);
		this.dom = elt(
			'div',
			{
				className:
					'fixed bottom-0 text-white left-0 flex flex-row justify-between items-center h-10 w-screen bg-custom-gray z-50',
			},
			this.leftStatus,
			elt('div', { className: 'text-white' }, 'Hello'),
		);
		this.syncState(state);
	}

	syncState(state) {
		this.canvasSizeText.textContent = `${state.picture.width} x ${state.picture.height}px`;
		if (!state.cursor) {
			this.pixelText.textContent = ``;
		} else {
			this.pixelText.textContent = `${state.cursor.x}, ${state.cursor.y}px`;
		}
	}
}
