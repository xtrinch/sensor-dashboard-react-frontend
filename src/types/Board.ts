import { makeAutoObservable } from 'mobx';
import Sensor, { SensorId } from 'types/Sensor';
import { AbstractEntity } from './AbstractEntity';

export type BoardId = string;

export interface BoardState {
  [id: string]: {
    id: SensorId;
    sensor?: Sensor;
    boardX: number;
    boardY: number;
  };
}

export default class Board implements AbstractEntity {
  constructor(b) {
    this.state = b.state;
    Object.values(this.state).forEach((v) => {
      v.sensor = new Sensor(v.sensor);
    });
    this.boardX = b.boardX;
    this.boardY = b.boardY;
    this.scale = b.scale;

    makeAutoObservable(this);
  }

  state: BoardState;

  scale: number;

  boardX: number; // top left

  boardY: number; // top left

  createdAt: Date;

  updatedAt: Date;
}
