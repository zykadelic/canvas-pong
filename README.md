# Canvas Pong

An exercise in Canvas2D and JavaScript game logic.

The js is structured in a way to allow the "client" full control of the HUD and other static GUI elements using html/css by exposing a selection of public methods on the main Game class to index.js while isolating/encapsulating the game logic and its depending classes.

## TODO

- Use the delta in requestAnimationFrame to smoothen out framerate spikes
- Do a full reset of the game area when starting a new game (player position etc.)
- Display player controls on the title screen
- Add highscore / list of past matches
- Add a visual bounding box of the game area that's inside of the screen size
- Implement [custom event emitters](https://css-tricks.com/understanding-event-emitters/) on the game class instances
