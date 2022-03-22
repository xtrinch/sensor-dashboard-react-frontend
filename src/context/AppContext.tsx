import { makeAutoObservable } from 'mobx';
import React, { createContext, useMemo } from 'react';
import DomainTypeEnum from 'types/DomainTypeEnum';
import { DateRange, DateRangeEnum, DateRegex } from 'utils/date.range';

export const AppContext = createContext<AppStore>(null);

class AppStore {
  public menuOpen: boolean = false;

  public groupBy: DateRangeEnum = DateRangeEnum.day;

  public date: DateRegex = DateRange.getDateString(new Date(), DateRangeEnum.day);

  public domain: DomainTypeEnum = DomainTypeEnum.FULL;

  constructor() {
    makeAutoObservable(this);
  }

  public drawerToggle = () => {
    this.menuOpen = !this.menuOpen;
  };

  public setDate = (date: DateRegex) => {
    this.date = date;
  };

  public setGroupBy = (groupBy: DateRangeEnum) => {
    this.groupBy = groupBy;
  };

  public setDomain = (domain: DomainTypeEnum) => {
    this.domain = domain;
  };
}

export function AppContextProvider(props) {
  const appStore = useMemo(() => new AppStore(), []);

  return <AppContext.Provider value={appStore}>{props.children}</AppContext.Provider>;
}
