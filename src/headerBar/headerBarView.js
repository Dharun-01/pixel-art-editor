import { createIconDom } from '../components/toggleIcon';
import { elt } from '../utils';
import { headerLeftConfig, headerRightConfig } from './config/headerBar.config';

export class HeaderView {
	constructor(handlers) {
		this.handlers = handlers;

		const left = elt(
			'div',
			{ className: 'flex flex-row pl-5 gap-x-8 items-center h-full' },
			...this.createLeftHeader(),
		);

		const right = elt(
			'div',
			{ className: 'flex flex-row pr-5 gap-x-8 items-center h-full ml-auto' },
			...this.createRightHeader(),
		);

		this.dom = elt(
			'div',
			{
				className:
					'fixed flex flex-row justify-between top-0 left-0 z-50 h-10 w-screen bg-custom-black',
			},
			left,
			right,
		);
	}

	/* The first part of the left side of the header */
	createLeftHeader() {
		return headerLeftConfig.map((option) =>
			elt(
				'p',
				{
					className:
						'text-md text-white hover:bg-custom-glass-black px-2 py-1 rounded-sm transition-all duration-150',
				},
				option,
			),
		);
	}

	/* Right part of the left side of the header (Icons like download, import, export, share, undo, redo) */
	createRightHeader() {
		const actions = [
			this.handlers.onDownload,
			this.handlers.onShare,
			this.handlers.onUpload,
			this.handlers.onExport,
			this.handlers.onUndo,
			this.handlers.onRedo,
		];
		return headerRightConfig.map((icon, i) =>
			createIconDom(
				icon,
				'hover:bg-custom-glass-black px-2 py-1 rounded-sm transition-all duration-150',
				actions[i],
			),
		);
	}
}
