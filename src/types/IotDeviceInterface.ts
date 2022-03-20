import BoardTypeEnum from 'types/BoardTypeEnum';
import User, { UserId } from 'types/User';

export interface IotDeviceInterface {
  id: string;

  name: string;

  visible: boolean;

  expanded: boolean;

  userId: UserId;

  user: User;

  location: string;

  boardType: BoardTypeEnum;

  accessToken: string;

  lastSeenAt: Date;

  private: boolean;
}
