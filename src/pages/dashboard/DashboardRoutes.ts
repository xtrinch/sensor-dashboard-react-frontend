import { DisplayId } from 'types/Display';
import { ForwarderId } from 'types/Forwarder';
import { RadioId } from 'types/Radio';
import { SensorId } from 'types/Sensor';

export const DashboardRoutes = {
  DASHBOARD: '/dashboard',
  ADD_SENSOR: '/dashboard-personal/add-sensor',
  CONNECT_SENSOR: '/dashboard-personal/sensors/:id/connect',
  ADD_DISPLAY: '/dashboard-personal/add-display',
  DISPLAY_CANVAS: '/dashboard-personal/displays/:id/canvas',
  ADD_FORWARDER: '/dashboard-personal/add-forwarder',
  ADD_RADIO: '/dashboard-personal/add-radio',
  SENSOR: '/dashboard-personal/sensors/:id',
  DISPLAY: '/dashboard-personal/displays/:id',
  FORWARDER: '/dashboard-personal/forwarders/:id',
  RADIO: '/dashboard-personal/radios/:id',
  DISPLAY_LIST: '/dashboard-personal/displays',
  FORWARDER_LIST: '/dashboard-personal/forwarders',
  RADIO_LIST: '/dashboard-personal/radios',
  TOPIC_BY_TAG: '/dashboard/static/:tag',
  PERSONAL_DASHBOARD: '/dashboard-personal',
};

export const getSensorRoute = (id: SensorId) => `/dashboard-personal/sensors/${id}`;
export const getConnectSensorRoute = (id: SensorId) => `/dashboard-personal/sensors/${id}/connect`;
export const getDisplayRoute = (id: DisplayId) => `/dashboard-personal/displays/${id}`;
export const getDisplayCanvasRoute = (id: DisplayId) => `/dashboard-personal/displays/${id}/canvas`;
export const getForwarderRoute = (id: ForwarderId) => `/dashboard-personal/forwarders/${id}`;
export const getRadioRoute = (id: RadioId) => `/dashboard-personal/radios/${id}`;
