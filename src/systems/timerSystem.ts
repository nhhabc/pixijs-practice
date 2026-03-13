import { Text } from "pixi.js";

export interface GameState {
  timeRemaining: number;
  frameCount: number;
}

export function timerSystem(
  state: GameState, 
  delta: number, 
  timerText: Text, 
  onTimeUp: () => void
) {
  state.frameCount += delta;
  if (state.frameCount >= 60) {
    state.timeRemaining--;
    state.frameCount = 0;
    timerText.text = `TIME: ${Math.ceil(state.timeRemaining)}`;

    if (state.timeRemaining <= 0) {
      state.timeRemaining = 0;
      onTimeUp();
    }
  }
}
