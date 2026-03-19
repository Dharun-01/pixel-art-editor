import { elt } from '../utils';

export class AppView {
	constructor(
		headerbarController,
		controls,
		sideControlsController,
		canvasController,
		statusbarController,
	) {
		this.headerView = headerbarController.view.dom;
		this.controls = controls;

		// Wrapping up the control
		this.controlsView = elt(
			'div',
			{
				className: 'controls-holder-style',
			},
			...this.createControls(),
		);

		this.sideControlsView = sideControlsController.view.dom;
		this.canvasView = canvasController.view.dom;
		this.statusbarView = statusbarController.view.dom;
		this.dom = this.buildDom();
	}

	createControls() {
		return this.controls.map((control) =>
			elt('div', { className: '' }, control.dom),
		);
	}

	buildDom() {
		this.portraitWarning = elt(
			'div',
			{
				className: 'portrait-warning-style',
			},
			elt('p', { className: 'text-5xl mb-4' }, '🔄'),
			elt(
				'p',
				{
					className: 'text-white text-lg text-center px-8 font-medium',
				},
				'Rotate your device for the best experience',
			),
			elt(
				'p',
				{
					className: 'text-white/50 text-sm text-center px-8 mt-2',
				},
				'This app works best in landscape mode',
			),
		);

		document.body.appendChild(this.portraitWarning);

		// Scrollable canvas area that fills the space between controls and statusbar
		const canvasArea = elt(
			'div',
			{
				className:
					' overflow-auto flex top-[160px] bottom-[40px] left-[12px] right-0 fixed',
			},
			elt(
				'div',
				{ className: 'm-auto' }, // auto margins center it when small, collapse when large
				this.canvasView,
			),
		);

		this.overlay = elt('div', {
			className: 'fixed inset-0 w-screen h-screen bg-black/50 z-20',
			// z-20 — below the popup (z-50) but above everything else
		});

		// appends the overlay into the controls view because if it lies in the parent appView, overlay z-index is greater than control's feature Div z-index and the popup inherits the z-index of the parent element thus losing the stack competition and the popup stays BEHIND the overlay.
		this.controlsView.appendChild(this.overlay);

		return elt(
			'div',
			{
				tabIndex: 0,
				className: 'flex flex-col w-full h-screen',
			},
			this.headerView,
			this.controlsView,
			this.sideControlsView,
			canvasArea,
			this.statusbarView,
		);
	}
}
