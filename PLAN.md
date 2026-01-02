## Feature: Grid Toggle

### What it does:

Overlays a grid on the canvas to show pixel boundaries

### Requirements:

- [ ] Checkbox control to toggle on/off
- [ ] Grid only shows when zoom >= 4
- [ ] Grid lines are semi-transparent
- [ ] State property: showGrid (boolean)

### Files to modify:

- index.html (add GridToggle control)
- drawPicture function (add grid rendering)
- startState (add showGrid: false)

### Testing:

- [ ] Toggle on/off works
- [ ] Grid doesn't show at 1x zoom
- [ ] Grid shows at 4x+ zoom
- [ ] Save/load preserves grid state
