import { elt } from '../utils';

export class PictureCanvasView {
	constructor(handlers) {
		this.handlers = handlers;
		this.dom = elt('canvas', {
			className: 'transition-all duration-150',
			onmousemove: (event) => handlers.onMouseMove(event),
			onmousedown: (event) => handlers.onMouseDown(event),
			onmouseleave: () => handlers.onMouseLeave(),
			ontouchstart: (event) => handlers.onTouchStart(event),
		});
	}
}
