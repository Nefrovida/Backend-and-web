import * as deviceModel from "#/src/model/devices/device.model";

export const registerDevice = async (deviceToken: string, userId: string) => {
  try {
    // Check if device is already registered
    const existingDevice = await deviceModel.checkIfDeviceIsRegistered(deviceToken);
    if (existingDevice) {
      throw new Error("Device already registered");
    }

    // Check if user is already registered
    const existingUser = await deviceModel.checkIfUserIsRegistered(userId);
    
    // If user is already registered, update the device token
    // If user is not registered, register and assign the new device
    if (!existingUser) {
        await deviceModel.registerDeviceToUser(deviceToken, userId);
    } else {
        await deviceModel.updateDeviceToken(deviceToken, userId);
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

export const getDeviceIdByUserId = async (userId: string) => {
  return await deviceModel.getDeviceIdByUserId(userId);
}