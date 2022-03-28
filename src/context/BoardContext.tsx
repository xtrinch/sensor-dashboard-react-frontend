import { AccountContext, AccountStore } from 'context/AccountContext';
import { compact } from 'lodash';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext, useMemo } from 'react';
import BoardService from 'services/BoardService';
import Board from 'types/Board';
import Sensor, { SensorId } from 'types/Sensor';
import { ToastContext, ToastStore } from './ToastContext';

export const BoardContext = createContext<BoardStore>(null);

export class BoardStore {
  public myBoard: Board = null;

  public myBoardLoaded: boolean = false;

  constructor(public accountStore: AccountStore, public toastStore: ToastStore) {
    makeAutoObservable(this);
  }

  get myBoardSensors(): Sensor[] {
    return compact(Object.values(this.myBoard?.state || {}).map((v) => (v as any)?.sensor)).map(
      (s) => {
        s.boardX = this.myBoard.state[s.id].boardX;
        s.boardY = this.myBoard.state[s.id].boardY;
        return s;
      },
    );
  }

  public getMyBoard = async () => {
    try {
      // to circumvent the fact we do not have loading statuses
      this.myBoard = null;
      const resp = await BoardService.getBoard();
      this.myBoard = resp;
      this.myBoardLoaded = true;
    } catch (error) {
      this.myBoardLoaded = true;
      throw error;
    }
  };

  public updateSensor = async (
    id: SensorId,
    newData: Partial<Sensor>,
    sensor: Sensor,
  ): Promise<Board> => {
    if (newData.isPinned === false) {
      this.myBoard.state[id] = undefined;
    } else {
      this.myBoard.state[id] = {
        ...this.myBoard.state[id],
        ...newData,
        sensor,
      };
    }
    const s = await BoardService.updateBoard(this.myBoard);

    return s;
  };

  public updateBoard = async (board: Partial<Board>): Promise<Board> => {
    this.myBoard = { ...this.myBoard, ...(board as Board) };
    const s = await BoardService.updateBoard(board);

    return s;
  };
}

export function BoardContextProvider(props) {
  const accountStore = useContext(AccountContext);
  const toastStore = useContext(ToastContext);
  const boardStore = useMemo(
    () => new BoardStore(accountStore, toastStore),
    [accountStore, toastStore],
  );

  return <BoardContext.Provider value={boardStore}>{props.children}</BoardContext.Provider>;
}
