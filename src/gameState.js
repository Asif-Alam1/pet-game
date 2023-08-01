import { modFox, modScene, togglePoopBag, toggleModal } from "./ui";
import {
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  dieTime: -1,
  hungryTime: -1,
  TimetoCelebrate: -1,
  pooTime: -1,
  TimetoEndCelebration: -1,

  scene: "day",
  tick() {
    this.clock++;
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.TimetoCelebrate) {
      this.celebrate();
    } else if (this.clock === this.pooTime) {
      this.poop();
    } else if (this.clock === this.TimetoEndCelebration) {
      this.endCelebration();
    }
  },
  poop() {
    this.current = "POOPING";
    modFox("pooping");
    this.pooTime = -1;
    this.dieTime = getNextDieTime(this.clock);
  },
  celebrate() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.TimetoCelebrate = -1;
    this.TimetoEndCelebration = this.clock + 2;
  },
  endCelebration() {
    this.current = "IDLING";
    this.TimetoEndCelebration = -1;
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (this.scene === "day") {
        modFox("idling");
      } else {
        modFox("rain");
      }
    }
  },
  die() {
    this.current = "DEAD";
    modScene("dead");
    modFox("dead");
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.TimetoCelebrate = -1;
    this.TimetoEndCelebration = -1;
    this.pooTime = -1;
    toggleModal(true);
    this.TimeAlive = 0;
    this.clock = 0;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    modFox("hungry");
    this.hungryTime = -1;
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.wakeTime = this.clock + 10;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.TimetoCelebrate = -1;
    this.TimetoEndCelebration = -1;
    this.pooTime = -1;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene(this.scene);
    toggleModal(true);
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > 0.5 ? "rain" : "day";
    modScene(this.scene);
    this.sleepTime = this.clock + 60;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
    toggleModal(false);
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }
    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    if (icon === "weather") {
      this.changeWeather();
    } else if (icon === "poop") {
      this.cleanUpPoop();
    } else if (icon === "fish") {
      this.feed();
    }
  },
  changeWeather() {
    if (this.current === "SLEEP") {
      return;
    }
    if (this.scene === "rain") {
      this.scene = "day";
      modScene("day");
      modFox("idling");
    } else {
      this.scene = "rain";
      modFox("rain");
      modScene("rain");
    }
  },
  cleanUpPoop() {
    if (this.current !== "POOPING") {
      return;
    }
    this.dieTime = -1;
    togglePoopBag(true);
    this.celebrate();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    if (this.current !== "HUNGRY") {
      return;
    }
    this.current = "FEEDING";
    this.dieTime = -1;
    this.hungryTime = -1;
    this.pooTime = getNextPoopTime(this.clock);

    this.TimetoCelebrate = this.clock + 2;
    modFox("eating");
  },
};
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
