import { parseISO } from "date-fns";
import { AbstractEntity } from "types/AbstractEntity";
import BoardTypeEnum from "types/BoardTypeEnum";
import { IotDeviceInterface } from "types/IotDeviceInterface";
import User, { UserId } from "types/User";

export type RadioId = string;

class Radio extends AbstractEntity implements IotDeviceInterface {
  constructor(s) {
    super(s);

    this.name = s?.name || "";
    this.displayName = s?.displayName || "";
    this.id = s?.id;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.accessToken = s?.accessToken;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.visible = s?.visible;
    this.expanded = s?.expanded;
    this.private = s?.private;
    this.config = s?.config || { presets: [] };
  }

  public id: RadioId;

  public name: string;

  public displayName: string; // eslint-disable-line

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: BoardTypeEnum;

  public accessToken: string;

  public lastSeenAt: Date;

  public private: boolean;

  public visible: boolean;

  public expanded: boolean;

  public config: any;
}

export default Radio;
