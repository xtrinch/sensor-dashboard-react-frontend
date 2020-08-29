import { parseISO } from "date-fns";
import { AbstractEntity } from "types/AbstractEntity";
import DisplayBoardTypesEnum from "types/DisplayBoardTypesEnum";
import User, { UserId } from "types/User";

export type DisplayId = number;

class Display extends AbstractEntity {
  constructor(s) {
    super(s);

    this.name = s?.name || "";
    this.id = s?.id;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.displayAccessToken = s?.displayAccessToken;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
  }

  public id: DisplayId;

  public name: string;

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: DisplayBoardTypesEnum;

  public displayAccessToken: string;

  public lastSeenAt: Date;
}

export default Display;
