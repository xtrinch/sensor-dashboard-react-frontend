import { DisplayId } from "types/Display";
import { ForwarderId } from "types/Forwarder";
import { SensorId } from "types/Sensor";

export const DashboardRoutes = {
  DASHBOARD: "/dashboard",
  ADD_SENSOR: "/dashboard/add-sensor",
  ADD_DISPLAY: "/dashboard/add-display",
  ADD_FORWARDER: "/dashboard/add-forwarder",
  SENSOR: "/dashboard/sensors/:id",
  DISPLAY: "/dashboard/displays/:id",
  FORWARDER: "/dashboard/forwarders/:id",
  DISPLAY_LIST: "/dashboard/displays",
  FORWARDER_LIST: "/dashboard/forwarders",
};

export const getSensorRoute = (id: SensorId) => `/dashboard/sensors/${id}`;
export const getDisplayRoute = (id: DisplayId) => `/dashboard/displays/${id}`;
export const getForwarderRoute = (id: ForwarderId) =>
  `/dashboard/forwarders/${id}`;
