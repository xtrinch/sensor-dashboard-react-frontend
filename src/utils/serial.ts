/* eslint no-undef: "off" */
// dependency: @types/w3c-web-usb

const filters: USBDeviceFilter[] = [
  { vendorId: 0x239a }, // Adafruit Boards!
  { vendorId: 0x303a }, // Espressif
  { vendorId: 0xcafe }, // Custom
  { vendorId: 0x2341 }, // Arduino
];

export class Port {
  public device: USBDevice;

  public interfaceNumber: number;

  public interface: USBInterface;

  public endpointIn: USBEndpoint;

  public endpointOut: USBEndpoint;

  constructor(device: USBDevice) {
    this.device = device;
    this.interfaceNumber = 2; // interface number defined in webusb arduino library
  }

  public async send(data: BufferSource): Promise<USBOutTransferResult> {
    const result = await this.device.transferOut(this.endpointOut.endpointNumber, data);
    return result;
  }

  public async disconnect(): Promise<void> {
    await this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber,
    });
    await this.device.close();
    this.interface = null;
    this.endpointIn = null;
    this.endpointOut = null;
  }

  public onReceive = (data: DataView): string => {
    const textDecoder = new TextDecoder();
    return textDecoder.decode(data);
  };

  public async readLoop(): Promise<string> {
    const result = await this.device.transferIn(this.endpointIn.endpointNumber, 64);
    const data = this.onReceive(result.data);
    return data;
  }

  public async connect() {
    await this.device.open();
    // if (this.device.configuration === null) {
    await this.device.selectConfiguration(1);
    // }

    // find the interface which has 0xff interface class as its alternate
    // and its interface number is 0 for esp, 2 for arduino
    this.interface = (this.device.configuration.interfaces || []).find(
      (c) =>
        !!c.alternates.find((a) => a.interfaceClass === 0xff) &&
        c.interfaceNumber === this.interfaceNumber,
    );
    if (!this.interface) {
      throw new Error('Interface not found');
    }
    const alternate = this.interface.alternates[0];

    this.endpointIn = alternate.endpoints.find((e) => e.direction === 'in');
    this.endpointOut = alternate.endpoints.find((e) => e.direction === 'out');

    if (!this.endpointIn || !this.endpointOut) {
      throw new Error('Endpoints not found');
    }

    await this.device.claimInterface(this.interface.interfaceNumber);

    await this.device.selectAlternateInterface(this.interface.interfaceNumber, 0);

    await this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: this.interface.interfaceNumber,
    });
  }
}

export class Serial {
  // check if we already have permission to access any connected devices
  public static async getPorts(): Promise<Port[]> {
    const devices = await navigator.usb.getDevices();
    return devices.map((device) => new Port(device));
  }

  // if this is the first time the user has visited the page then it won’t have
  // permission to access any devices
  public static async requestPort(ownFilters?: USBDeviceFilter[]): Promise<Port | null> {
    let device;

    try {
      device = await navigator.usb.requestDevice({
        filters: ownFilters || filters,
      });
    } catch (e) {
      console.error(e);
      // if we don't select any device, this requestDevice throws an error
      return null;
    } finally {
      if (device) {
        const port = new Port(device);
        return port;
      }
      return null;
    }
  }
}
