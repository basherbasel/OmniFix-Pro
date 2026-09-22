import { DeviceInfo } from '../types';

export interface RawUsbDevice {
  vendorId: number;
  productId: number;
  serialNumber?: string;
  productName?: string;
  vendorName?: string;
  osType?: 'android' | 'ios';
  mode?: 'normal' | 'recovery' | 'fastboot' | 'edl_9008' | 'apple_dfu' | 'apple_recovery' | 'brom';
  chipsetGuess?: string;
  carrierGuess?: string;
}

class HardwareBridge {
  private static instance: HardwareBridge;
  private activeDevice: USBDevice | null = null;
  private onConnectCallback: ((device: RawUsbDevice) => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): HardwareBridge {
    if (!HardwareBridge.instance) {
      HardwareBridge.instance = new HardwareBridge();
    }
    return HardwareBridge.instance;
  }

  private setupListeners() {
    if (typeof navigator !== 'undefined' && navigator.usb) {
      navigator.usb.addEventListener('connect', (event) => {
        console.log('USB Device Connected:', event.device);
        this.handleNewDevice(event.device);
      });

      navigator.usb.addEventListener('disconnect', (event) => {
        console.log('USB Device Disconnected:', event.device);
        if (this.activeDevice === event.device) {
          this.activeDevice = null;
          if (this.onDisconnectCallback) this.onDisconnectCallback();
        }
      });
    }
  }

  public async requestWebUsbDevice(): Promise<{ success: boolean; device?: RawUsbDevice; error?: string }> {
    try {
      if (!navigator.usb) {
        throw new Error('WebUSB API is not supported in this browser context.');
      }

      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x05ac }, // Apple
          { vendorId: 0x04e8 }, // Samsung
          { vendorId: 0x18d1 }, // Google
          { vendorId: 0x12d1 }, // Huawei
          { vendorId: 0x05c6 }, // Qualcomm
          { vendorId: 0x0e8d }, // MediaTek
          { vendorId: 0x2717 }, // Xiaomi
        ]
      });

      await device.open();
      
      // Auto-configure device if not configured
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      
      // Attempt to claim the first available interface (common for mobile debug modes)
      try {
        await device.claimInterface(0);
      } catch (e) {
        console.warn('Could not claim interface 0, proceeding anyway...');
      }

      this.activeDevice = device;
      const raw = this.mapToRaw(device);
      
      if (this.onConnectCallback) this.onConnectCallback(raw);
      
      return { success: true, device: raw };
    } catch (err: any) {
      console.error('WebUSB Connection Error:', err);
      let errorMsg = err.message || 'Connection failed';
      if (err.name === 'SecurityError') errorMsg = 'تم رفض الوصول للجهاز من قبل المتصفح أو المستخدم.';
      if (err.name === 'NotFoundError') errorMsg = 'لم يتم اختيار أي جهاز.';
      return { success: false, error: errorMsg };
    }
  }

  private handleNewDevice(device: USBDevice) {
    const raw = this.mapToRaw(device);
    if (this.onConnectCallback) this.onConnectCallback(raw);
  }

  private mapToRaw(device: USBDevice): RawUsbDevice {
    const vid = device.vendorId;
    const pid = device.productId;

    let mode: RawUsbDevice['mode'] = 'normal';
    let osType: RawUsbDevice['osType'] = 'android';

    // Basic heuristic for boot modes
    if (vid === 0x05c6 && (pid === 0x9008 || pid === 0x900e)) mode = 'edl_9008';
    if (vid === 0x0e8d && pid === 0x0003) mode = 'brom';
    if (vid === 0x05ac && (pid === 0x1227 || pid === 0x1222)) mode = 'apple_dfu';
    if (vid === 0x05ac) osType = 'ios';

    return {
      vendorId: vid,
      productId: pid,
      serialNumber: device.serialNumber,
      productName: device.productName,
      vendorName: device.vendorName,
      osType,
      mode,
      chipsetGuess: this.guessChipset(vid, pid),
    };
  }

  private guessChipset(vid: number, pid: number): string {
    if (vid === 0x05c6) return 'Qualcomm Snapdragon';
    if (vid === 0x0e8d) return 'MediaTek Dimensity/Helio';
    if (vid === 0x05ac) return 'Apple Silicon (A-Series)';
    if (vid === 0x04e8) return 'Samsung Exynos';
    if (vid === 0x18d1) return 'Google Tensor';
    return 'Generic SoC';
  }

  public onConnect(callback: (device: RawUsbDevice) => void) {
    this.onConnectCallback = callback;
  }

  public onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  public isDeviceConnected(): boolean {
    return this.activeDevice !== null && this.activeDevice.opened;
  }

  public async executeCommandOnRealHardware(cmd: string): Promise<{ success: boolean; output: string }> {
    // This would involve sending vendor-specific USB packets
    // Mocking for now to show the flow
    console.log(`Executing ${cmd} on physical hardware...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, output: `[Hardware Echo] Command "${cmd}" received and processed.` });
      }, 500);
    });
  }
}

export const hardwareBridge = HardwareBridge.getInstance();
