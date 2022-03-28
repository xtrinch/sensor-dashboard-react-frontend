import Board from 'types/Board';
import { getHeaders, getUrl, processResponse } from 'utils/http';

export default class BoardService {
  public static updateBoard = async (sensor: Partial<Board>): Promise<Board> => {
    const url = getUrl(`/boards/my`);

    const resp = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
      body: JSON.stringify(sensor),
    });

    const result = await processResponse(resp);
    const s = new Board(result);
    return s;
  };

  public static getBoard = async (): Promise<Board> => {
    const url = getUrl(`/boards/my`);

    const resp = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders({ contentType: 'application/json' }),
    });

    const result = await processResponse(resp);
    const s = new Board(result);
    return s;
  };
}
