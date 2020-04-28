import { parseISO, differenceInSeconds } from "date-fns";
import Config from "config/Config";

function toArkTimestamp(date: Date): number {
  // devnet epoch
  const arkEpoch = parseISO(Config.arkEpoch);

  const secondsDifference = Math.abs(differenceInSeconds(arkEpoch, date));

  return secondsDifference;
}

export default toArkTimestamp;
