import { makeAutoObservable } from 'mobx';
import { AbstractEntity } from './AbstractEntity';

export type BoardId = string;

export interface BoardState {
  objects: any[]; // TODO
}

export default class Board implements AbstractEntity {
  constructor(b) {
    this.state = b.state;
    // Object.values(this.state).forEach((v) => {
    //   v.sensor = new Sensor(v.sensor);
    // });
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
