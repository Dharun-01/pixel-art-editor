import { elt } from '../utils';

export class AppView {
	constructor(
		handlers,
		headerbarController,
		controls,
		sideControlsController,
		canvasController,
		statusbarController,
	) {
		this.handlers = handlers;
		this.headerView = headerbarController.view.dom;
		this.controls = controls;

		// Wrapping up the control
		this.controlsView = elt(
			'div',
			{
				className:
					'fixed flex flex-row items-center h-27 w-full bg-custom-gray top-12 left-0 z-10',
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
				onkeydown: (event) => {
					this.handlers.onKeyDown(event);
				},
			},
			this.headerView,
			this.controlsView,
			this.sideControlsView,
			canvasArea,
			this.statusbarView,
		);
	}
}
