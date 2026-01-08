import { Picture } from './picture.js';
import { hexToRgb } from './utils.js';

import { draw, fill, rectangle, pick, line, erase, circle } from './tools.js';
import {
	ToolSelect,
	ColorSelect,
	SketchSelect,
	SaveButton,
	LoadButton,
	UndoButton,
	RedoButton,
	EraseButton,
	EraseAllButton,
	ZoomControls,
} from './controls.js';
export let startState = {
	tool: 'draw',
	sketch: 'Pencil',
	color: new Uint8ClampedArray([0, 0, 0, 255]),
	picture: Picture.empty(1000, 400, hexToRgb('#f0f0f0')),
	previewPicture: null,
	redone: [],
	done: [],
	zoom: 1,
	doneAt: 0,
};

export let baseTools = { draw, fill, rectangle, pick, circle, line, erase };
export let baseSketches = { marker: 'Marker', pencil: 'Pencil' };
export let baseControls = [
	ToolSelect,
	ColorSelect,
	SketchSelect,
	SaveButton,
	LoadButton,
	UndoButton,
	RedoButton,
	EraseButton,
	EraseAllButton,
	ZoomControls,
];
