export class Timer {

  time = 600;

  update(delta: number) {

    this.time -= delta / 60;

    if (this.time <= 0) {

      this.time = 0;

    }

  }

}