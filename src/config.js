import { createInitialState } from './state/factory.js';
import { ImageSelectController } from './controls/controller/ImageController.js';
import { ToolSelectController } from './controls/controller/toolController.js';
import { BrushSelectController } from './controls/controller/brushController.js';
import { ShapeSelectController } from './controls/controller/shapeController.js';
import { pencil, brush } from './tools/drawingTools.js';

import {
	line,
	triangle,
	rightTriangle,
	rhombus,
	square,
	rectangle,
	pentagon,
	hexagon,
	star,
	fourPointStar,
	sixPointStar,
	circle,
	heart,
} from './tools/shapeTools.js';

import { fill, pick, erase, zoomPlus } from './tools/utilityTools.js';

export let startState = createInitialState();

export let baseTools = {
	pencil,
	brush,
	fill,
	zoomPlus,
	rectangle,
	pick,
	circle,
	line,
	triangle,
	erase,
	rhombus,
	square,
	rightTriangle,
	pentagon,
	hexagon,
	star,
	fourPointStar,
	sixPointStar,
	heart,
};

export let baseControls = [
	ImageSelectController,
	ToolSelectController,
	BrushSelectController,
	ShapeSelectController,
];
