import { prisma } from "#/src/util/prisma";
import { checkIfDeviceIsRegistered, checkIfUserIsRegistered, registerDeviceToUser, updateDeviceToken } from "#/src/model/devices/device.model";

export const registerDevice = async (deviceToken: string, userId: string) => {
  try {
    // Check if device is already registered
    const existingDevice = await checkIfDeviceIsRegistered(deviceToken);
    if (existingDevice) {
      throw new Error("Device already registered");
    }

    // Check if user is already registered
    const existingUser = await checkIfUserIsRegistered(userId);
    
    // If user is already registered, update the device token
    // If user is not registered, register and assign the new device
    if (!existingUser) {
        await registerDeviceToUser(deviceToken, userId);
    } else {
        await updateDeviceToken(deviceToken, userId);
    }

    return {
        success: true,
        message: "Device registered successfully",
    };    
  } catch (error) {
    console.error("Error registering device:", error);
    throw new Error("Failed to register device");
  }
}