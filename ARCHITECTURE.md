# Architecture Documentation

## Overview

This is a component-based pixel art editor using vanilla JavaScript.

## Core Concepts

### 1. Immutable State

State is never modified directly. Always create new objects:

```javascript
// ❌ Bad
state.color = '#ff0000';

// ✅ Good
state = { ...state, color: '#ff0000' };
```

### 2. Data Flow

```
User Action → Tool Function → Dispatch → State Update → UI Sync
```

Example: Drawing a pixel

1. User clicks canvas
2. `PictureCanvas.mouse()` captures click
3. Tool function (e.g., `draw()`) is called
4. `dispatch({picture: newPicture})` updates state
5. `app.syncState()` re-renders UI

## Core Classes

### Picture

**Purpose:** Immutable data structure holding pixel data

**Key Methods:**

- `Picture.empty(width, height, color)` - Create blank canvas
- `pixel(x, y)` - Get color at position
- `draw(pixels)` - Create new Picture with pixels changed

**Example:**

```javascript
let pic = Picture.empty(100, 100, '#ffffff');
let newPic = pic.draw([{ x: 10, y: 10, color: '#000000' }]);
// pic is unchanged, newPic has the new pixel
```

### PictureCanvas

**Purpose:** Renders Picture to HTML canvas, handles mouse/touch input

**Key Properties:**

- `dom` - The canvas element
- `picture` - Current Picture being displayed
- `zoom` - Current zoom level

**Key Methods:**

- `syncState(picture, state)` - Update canvas when state changes
- `mouse(event, onDown, state)` - Handle mouse interactions
- `touch(event, onDown, state)` - Handle touch interactions

### PixelEditor

**Purpose:** Main application coordinator

**Manages:**

- Canvas rendering
- Control buttons
- State updates
- Keyboard shortcuts

### Controls (Buttons/Inputs)

Each control is a class:

- `ToolSelect` - Tool dropdown
- `ColorSelect` - Color picker
- `SaveButton` - Export image
- `UndoButton` - Undo action
- etc.

**Pattern:** All controls have:

```javascript
constructor(state, config) {
  // Create DOM elements
  this.dom = elt("button", ...);
}

syncState(state) {
  // Update when state changes
}
```

## State Object

The entire application state:

```javascript
{
  tool: "draw",           // Current tool name
  sketch: "Pencil",       // Brush style
  color: "#000000",       // Current color
  picture: Picture,       // Current image
  done: [Picture],        // Undo history
  redone: [Picture],      // Redo history
  zoom: 1,               // Zoom level
  doneAt: timestamp      // Last edit time
}
```

## Tool Functions

Tools are functions that handle drawing interactions:

```javascript
function toolName(pos, state, dispatch) {
	// pos: {x, y} - starting position
	// state: current app state
	// dispatch: function to update state

	// Do immediate action (optional)

	// Return move handler for dragging (optional)
	return function (newPos, state) {
		// Handle mouse movement
	};
}
```

**Tool Examples:**

**Simple tool (no dragging):**

```javascript
function pick(pos, state, dispatch) {
	// Just pick color, no drag needed
	dispatch({ color: state.picture.pixel(pos.x, pos.y) });
	// Return nothing = no drag handler
}
```

**Drag tool:**

```javascript
function draw(pos, state, dispatch) {
	function connect(newPos, state) {
		// Draw line from pos to newPos
		let line = drawLine(pos, newPos, state.color);
		pos = newPos; // Update for next movement
		dispatch({ picture: state.picture.draw(line) });
	}
	connect(pos, state); // Draw initial point
	return connect; // Return for dragging
}
```

## Helper Functions

### drawLine(from, to, color)

Bresenham's line algorithm - creates array of pixels from point A to B

### applyBrush(points, state)

Expands points into brush strokes based on tool/sketch

### elt(type, props, ...children)

DOM element creator helper

### pointerPosition(event, domNode, zoom)

Converts mouse/touch coordinates to pixel grid position

## State Management

### historyUpdateState(state, action)

Central state reducer. Handles:

- `{undo: true}` - Undo last action
- `{redo: true}` - Redo last undone action
- `{picture: newPicture}` - New drawing (adds to history)
- Any other property - Direct update

**History mechanism:**

- Drawing actions add current picture to `done` array
- Undo moves picture from `done` to `redone`
- Redo moves picture from `redone` to `done`
- New drawings clear `redone` array

## Adding New Features

### Adding a New Tool

1. **Create tool function:**

```javascript
function myNewTool(pos, state, dispatch) {
	// Your tool logic
	return moveHandler; // or nothing
}
```

2. **Register in baseTools:**

```javascript
let baseTools = {
	draw,
	fill,
	rectangle,
	myNewTool, // Add here
	pick,
	circle,
	line,
	erase,
};
```

3. **Done!** Tool appears in dropdown automatically

### Adding a New Control

1. **Create control class:**

```javascript
class MyControl {
	constructor(state, { dispatch }) {
		this.dom = elt(
			'button',
			{
				onclick: () =>
					dispatch({
						/* action */
					}),
			},
			'My Button'
		);
	}

	syncState(state) {
		// Update button based on state
	}
}
```

2. **Register in baseControls:**

```javascript
let baseControls = [
  ToolSelect, ColorSelect,
  MyControl,  // Add here
  SaveButton, LoadButton, ...
];
```

3. **Done!** Control appears in UI automatically

### Adding State Properties

1. **Add to startState:**

```javascript
let startState = {
	tool: 'draw',
	myNewProperty: defaultValue, // Add here
	// ...
};
```

2. **Update in tools/controls:**

```javascript
dispatch({ myNewProperty: newValue });
```

3. **Use in components:**

```javascript
syncState(state) {
  console.log(state.myNewProperty);
}
```

## Common Patterns

### Checking bounds

```javascript
if (x >= 0 && x < state.picture.width && y >= 0 && y < state.picture.height) {
	// Safe to access pixel
}
```

### Creating new picture

```javascript
let pixels = [{ x: 10, y: 10, color: '#ff0000' }];
let newPicture = state.picture.draw(pixels);
dispatch({ picture: newPicture });
```

### Preventing default behavior

```javascript
element.addEventListener('mousedown', (event) => {
	event.preventDefault(); // Stop browser defaults
	// Your code
});
```

## Known Issues

## Future Improvements

See [TODO.md](TODO.md) for planned features.
