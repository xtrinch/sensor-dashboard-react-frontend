import { addToast } from 'context/ToastContext';
import React, { createContext, useEffect, useState } from 'react';
import RadioService from 'services/RadioService';
import Radio, { RadioId } from 'types/Radio';
import { Toast } from 'types/Toast';

const RadioContext = createContext<{
  state?: {
    radiosLoaded: boolean;
    radios: Radio[];
  };
  updateRadio?: (id: RadioId, radio: Radio) => Promise<Radio>;
  addRadio?: (radio: Radio) => Promise<Radio>;
  deleteRadio?: (id: RadioId) => Promise<boolean>;
  reload?: () => Promise<void>;
  sendConfig?: (id: RadioId) => Promise<void>;
  readConfig?: (id: RadioId) => Promise<void>;
}>({});

function RadioContextProvider(props: { children: any }) {
  const [state, setState] = useState({
    radios: [],
    radiosLoaded: false,
  });

  const reload = async () => {
    const resp = await RadioService.listRadios();
    const radioData = resp.items;

    setState({ ...state, radios: radioData, radiosLoaded: true });
  };

  const updateRadio = async (id: RadioId, radio: Partial<Radio>): Promise<Radio> => {
    const s = await RadioService.updateRadio(id, radio);

    const { radios } = state;
    const radioIndex = radios.findIndex((s) => s.id === id);
    radios[radioIndex] = s;
    setState({ ...state, radios: [...radios] });

    addToast(
      new Toast({
        message: 'Successfully updated the radio',
        type: 'success',
      }),
    );

    return s;
  };

  const readConfig = async (id: RadioId): Promise<void> => {
    await RadioService.readConfig(id);

    addToast(
      new Toast({
        message: 'Read config command sent, refresh page to see results.',
        type: 'success',
      }),
    );
  };

  const sendConfig = async (id: RadioId): Promise<void> => {
    await RadioService.sendConfig(id);

    addToast(
      new Toast({
        message: 'Send config command sent',
        type: 'success',
      }),
    );
  };

  const deleteRadio = async (id: RadioId): Promise<boolean> => {
    await RadioService.deleteRadio(id);

    const idx = state.radios.findIndex((s) => s.id === id);
    state.radios.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: 'Successfully deleted the radio',
        type: 'success',
      }),
    );

    return true;
  };

  const addRadio = async (radio: Partial<Radio>): Promise<Radio> => {
    const s = await RadioService.addRadio(radio);
    setState({ ...state, radios: [...state.radios, s] });

    addToast(new Toast({ message: 'Successfully added a radio', type: 'success' }));

    return s;
  };

  useEffect(() => {
    if (!state.radiosLoaded) {
      reload();
    }
  }, [state]);

  return (
    <RadioContext.Provider
      value={{
        state,
        updateRadio,
        deleteRadio,
        addRadio,
        reload,
        sendConfig,
        readConfig,
      }}
    >
      {props.children}
    </RadioContext.Provider>
  );
}

export { RadioContext, RadioContextProvider };
