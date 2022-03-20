import { AccountContext } from 'context/AccountContext';
import { addToast } from 'context/ToastContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ForwarderService from 'services/ForwarderService';
import Forwarder, { ForwarderId } from 'types/Forwarder';
import { Toast } from 'types/Toast';

const ForwarderContext = createContext<{
  state?: {
    forwardersLoaded: boolean;
    forwarders: Forwarder[];
  };
  updateForwarder?: (id: ForwarderId, forwarder: Forwarder) => Promise<Forwarder>;
  deleteForwarder?: (id: ForwarderId) => Promise<boolean>;
  addForwarder?: (forwarder: Partial<Forwarder>) => Promise<Forwarder>;
  reload?: () => Promise<void>;
}>({});

function ForwarderContextProvider(props) {
  let [state, setState] = useState({
    forwarders: [],
    forwardersLoaded: false,
  });
  let { loginState } = useContext(AccountContext);

  const reload = async () => {
    if (loginState === 'LOGGED_OUT') {
      return;
    }

    const resp = await ForwarderService.listForwarders();
    const forwarderData = resp.items;
    setState({ ...state, forwarders: forwarderData, forwardersLoaded: true });
  };

  const addForwarder = async (forwarder: Partial<Forwarder>): Promise<Forwarder> => {
    const s = await ForwarderService.addForwarder(forwarder);
    setState({ ...state, forwarders: [...state.forwarders, s] });

    addToast(new Toast({ message: 'Successfully added a forwarder', type: 'success' }));

    return s;
  };

  const updateForwarder = async (
    id: ForwarderId,
    forwarder: Partial<Forwarder>
  ): Promise<Forwarder> => {
    const s = await ForwarderService.updateForwarder(id, forwarder);
    const forwarders = state.forwarders;
    const forwarderIndex = forwarders.findIndex((sd) => sd.id === s.id);
    forwarders[forwarderIndex] = s;
    setState({ ...state, forwarders: [...forwarders] });

    addToast(
      new Toast({
        message: 'Successfully updated the forwarder',
        type: 'success',
      })
    );

    return s;
  };

  const deleteForwarder = async (id: ForwarderId): Promise<boolean> => {
    await ForwarderService.deleteForwarder(id);

    const idx = state.forwarders.findIndex((s) => s.id === id);
    state.forwarders.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: 'Successfully deleted the forwarder',
        type: 'success',
      })
    );

    return true;
  };

  useEffect(() => {
    if (!state.forwardersLoaded) {
      reload();
    }
  }, [state]);

  return (
    <ForwarderContext.Provider
      value={{ state, updateForwarder, deleteForwarder, addForwarder, reload }}
    >
      {props.children}
    </ForwarderContext.Provider>
  );
}

export { ForwarderContext, ForwarderContextProvider };
