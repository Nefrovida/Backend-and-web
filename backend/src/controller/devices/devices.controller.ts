import { Request, Response } from "express";
import { registerDevice as registerDeviceService } from "#/src/service/devices/devices.service";

export const registerDevice = async (req: Request, res: Response) => {
  try {
    const { deviceToken } = req.body;
    const user = req.user;

    if (!user || !user.userId || !deviceToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await registerDeviceService(deviceToken, user.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error registering device:", error);
    res.status(500).json({ error: "Failed to register device" });
  }
}

const registerDeviceController = {
  registerDevice,
}

export default registerDeviceController;