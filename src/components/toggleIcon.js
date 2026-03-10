import { elt } from '../utils';
export function createIconDom(srcImage, classes, dispatchAction) {
	return elt('img', {
		className: `${classes}`,
		src: srcImage,
		onclick: (event) => {
			event.stopPropagation();
			if (dispatchAction) dispatchAction();
		},
	});
}
