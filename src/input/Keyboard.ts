export class Keyboard {

  static keys: Record<string, boolean> = {};

  static init() {

    window.addEventListener("keydown", (e) => {

      Keyboard.keys[e.code] = true;

    });

    window.addEventListener("keyup", (e) => {

      Keyboard.keys[e.code] = false;

    });

  }

  static isDown(key: string) {

    return Keyboard.keys[key];

  }

}