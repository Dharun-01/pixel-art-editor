import { Picture } from './picture.js';
import { hexToRgb } from './utils.js';
import {
	draw,
	fill,
	rectangle,
	pick,
	line,
	erase,
	circle,
	rhombus,
} from './tools.js';

import {
	ImageSelect,
	ToolSelect,
	ColorSelect,
	SketchSelect,
	SaveButton,
	LoadButton,
	UndoButton,
	RedoButton,
	EraseButton,
	EraseAllButton,
} from './controls.js';

export let startState = {
	tool: 'draw',
	sketch: 'Pencil',
	color: new Uint8ClampedArray([0, 0, 0, 255]),
	cursor: false,
	picture: Picture.empty(1000, 400, hexToRgb('#f0f0f0')),
	previewPicture: null,
	redone: [],
	toggleRotate: false,
	toggleFlip: false,
	toggleMirror: false,
	toggleResize: false,
	toggleLinkIcon: false,
	toggleGrid: false,
	togglePencil: false,
	toggleFill: false,
	toggleErase: false,
	toggleColorPicker: false,
	toggleZoomPlus: false,
	toggleZoomSelect: false,
	toggleZoomSelectDownArrow: false,
	rotate: null,
	flip: null,
	mirrorVertical: false,
	mirrorHorizontal: false,
	mirrorMainDiagonal: false,
	mirrorOffDiagonal: false,
	done: [],
	zoom: 1,
	doneAt: 0,
};

export let baseTools = {
	draw,
	fill,
	rectangle,
	pick,
	circle,
	line,
	erase,
	rhombus,
};
export let baseSketches = { marker: 'Marker', pencil: 'Pencil' };
export let baseControls = [
	ImageSelect,
	ToolSelect,
	ColorSelect,
	SketchSelect,
	SaveButton,
	LoadButton,
	UndoButton,
	RedoButton,
	EraseButton,
	EraseAllButton,
];
