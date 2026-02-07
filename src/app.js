import { PictureCanvas } from './canvas.js';
import { historyUpdateState } from './history.js';
import { StatusBar } from './statusbar.js';
import { SideControls } from './sidecontrols.js';
import { startState, baseTools, baseControls, baseSketches } from './config.js';
import { elt, iconDownloader } from './utils.js';
import './input.css';

export class PixelEditor {
	constructor(state, config) {
		let { tools, sketches, controls, dispatch } = config;
		this.state = state;
		this.sketch = sketches[this.state.sketch];
		this.statusBar = new StatusBar(this.state, dispatch);
		this.sideControls = new SideControls(this.state, dispatch);
		this.canvas = new PictureCanvas(
			state.picture,
			(pos) => {
				let tool = tools[this.state.tool];
				try {
					let onMove = tool(pos, this.state, dispatch);
					if (onMove) return (pos, isFinal) => onMove(pos, this.state, isFinal);
				} catch (error) {
					console.error(error);
					alert(`Don't "fill" from Corners OR "Drag" with "fill"`);
				}
			},
			this.state,
			config,
			this.statusBar,
		);
		this.controls = controls.map((Control) => {
			return new Control(state, config);
		});
		/* console.log(this.controls); */
		this.dom = elt(
			'div',
			{
				tabIndex: 0,
				className:
					'flex flex-column overflow-scroll-x overflow-scroll-y align-middle items-center justify-center',
				onkeydown: (event) => {
					this.keyDown(event, config);
				},
			},
			// Header with menu and SVG
			elt(
				'div',
				{
					className:
						'fixed flex flex-row align-middle top-0 left-0 z-50 h-10 w-screen bg-custom-black',
				},
				elt(
					'div',
					{ className: 'flex flex-row pl-5 gap-x-8 items-center h-full' },
					elt(
						'p',
						{
							className:
								'text-md text-white hover:bg-custom-glass-black px-2 py-1 rounded-sm',
						},
						'File',
					),
					elt(
						'p',
						{
							className:
								'text-md text-white hover:bg-custom-glass-black px-2 py-1 rounded-sm',
						},
						'Edit',
					),
					elt(
						'p',
						{
							className:
								'text-md text-white hover:bg-custom-glass-black px-2 py-1 rounded-sm',
						},
						'View',
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'M288-288h384v-72H288v72Zm192-120 144-144-51-51-57 57v-150h-72v150l-57-57-51 51 144 144Zm.28 312Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z',
							}),
						),
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'M648-96q-50 0-85-35t-35-85q0-9 4-29L295-390q-16 14-36.05 22-20.04 8-42.95 8-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 43 8t36 22l237-145q-2-7-3-13.81-1-6.81-1-15.19 0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-43-8t-36-22L332-509q2 7 3 13.81 1 6.81 1 15.19 0 8.38-1 15.19-1 6.81-3 13.81l237 145q16-14 36.05-22 20.04-8 42.95-8 50 0 85 35t35 85q0 50-35 85t-85 35Zm0-72q20.4 0 34.2-13.8Q696-195.6 696-216q0-20.4-13.8-34.2Q668.4-264 648-264q-20.4 0-34.2 13.8Q600-236.4 600-216q0 20.4 13.8 34.2Q627.6-168 648-168ZM216-432q20.4 0 34.2-13.8Q264-459.6 264-480q0-20.4-13.8-34.2Q236.4-528 216-528q-20.4 0-34.2 13.8Q168-500.4 168-480q0 20.4 13.8 34.2Q195.6-432 216-432Zm432-264q20.4 0 34.2-13.8Q696-723.6 696-744q0-20.4-13.8-34.2Q668.4-792 648-792q-20.4 0-34.2 13.8Q600-764.4 600-744q0 20.4 13.8 34.2Q627.6-696 648-696Zm0 480ZM216-480Zm432-264Z',
							}),
						),
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'm732-120 144-144-51-51-57 57v-150h-72v150l-57-57-51 51 144 144ZM588 0v-72h288V0H588ZM264-144q-29 0-50.5-21.5T192-216v-576q0-29 21.5-50.5T264-864h312l192 192v192h-72v-144H528v-168H264v576h264v72H264Zm0-72v-576 576Z',
							}),
						),
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'M480-480ZM230-83l-50-51 106-106h-82v-72h204v204h-72v-81L230-83Zm250-13v-72h216v-456H528v-168H264v408h-72v-408q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.15 50.85Q725.7-96 696-96H480Z',
							}),
						),
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'M288-192v-72h288q50 0 85-35t35-85q0-50-35-85t-85-35H330l93 93-51 51-180-180 180-180 51 51-93 93h246q80 0 136 56t56 136q0 80-56 136t-136 56H288Z',
							}),
						),
					),
					elt(
						'p',
						{ className: 'hover:bg-custom-glass-black px-2 py-1 rounded-sm' },
						elt(
							'svg',
							iconDownloader(
								'http://www.w3.org/2000/svg',
								'22px',
								'0 -960 960 960',
								'22px',
								'#e3e3e3',
							),
							elt('path', {
								d: 'M384-192q-80 0-136-56t-56-136q0-80 56-136t136-56h246l-93-93 51-51 180 180-180 180-51-51 93-93H384q-50 0-85 35t-35 85q0 50 35 85t85 35h288v72H384Z',
							}),
						),
					),
				),
			),
			// Controls section
			elt(
				'div',
				{
					className:
						'fixed flex flex-row  items-center h-27 w-full bg-custom-gray top-10 left-0 z-40',
				},
				elt(
					'div',
					{ className: 'text-gray-300 h-25 w-full outline' },
					this.controls[0].dom,
				),
				elt(
					'div',
					{ className: 'text-gray-300 h-25 w-full outline' },
					this.controls[1].dom,
				),
				elt(
					'div',
					{
						className:
							'text-gray-200 text-sm flex flex-row justify-center items-center h-25 min-w-18 outline',
					},
					this.controls[2].dom,
				),
				elt('div', { className: 'text-gray-300 h-25 w-full outline' }, 'Hello'),
				elt('div', { className: 'text-gray-300 h-25 w-full outline' }, 'Hello'),
				elt('div', { className: 'text-gray-300 h-25 w-full outline' }, 'Hello'),
				/* ...this.controls.reduce((a, c) => a.concat(' ', c.dom), []), */
			),
			this.sideControls.dom,
			this.canvas.dom,
			this.statusBar.dom,
		);
	}

	keyDown(event, config) {
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			if (event.key == 'z') {
				config.dispatch({ undo: true });
			} else {
				config.dispatch({ redo: true });
			}
		} else if (!event.shiftKey) {
			for (let tool of Object.keys(config.tools)) {
				if (tool[0] == event.key) {
					event.preventDefault();
					config.dispatch({ tool });
					return;
				}
			}
		} else {
			for (let sketch of Object.values(config.sketches)) {
				if (sketch[0] == event.key && event.shiftKey) {
					event.preventDefault();
					config.dispatch({ sketch: sketch });
					return;
				}
			}
		}
	}

	syncState(state) {
		let pic = state.previewPicture ?? state.picture;
		this.state = state;
		this.canvas.syncState(pic, this.state);
		this.statusBar.syncState(this.state);
		this.sideControls.syncState(this.state);
		for (let ctrl of this.controls) ctrl.syncState(this.state);
	}
}

export function startPixelEditor({
	state = startState,
	tools = baseTools,
	sketches = baseSketches,
	controls = baseControls,
}) {
	let app = new PixelEditor(state, {
		tools,
		sketches,
		controls,
		dispatch(action) {
			state = historyUpdateState(state, action);
			app.syncState(state);
		},
	});
	return app.dom;
}

const app = startPixelEditor({});
document.getElementById('app').appendChild(app);
