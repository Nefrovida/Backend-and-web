import { prisma } from "#/src/util/prisma";


export const checkIfDeviceIsRegistered = async (deviceToken: string) => {
    try {
        const device = await prisma.devices.findFirst({
            where: {
                device_token: deviceToken,
            },
        });
        if (device) {
            return device;
        }
        throw new Error("Device not found");
    } catch (error) {
        throw new Error("Error querying database for device");
    }
}

export const checkIfUserIsRegistered = async (userId: string) => {
    try {
        const user = await prisma.devices.findUnique({
            where: {
                user_id: userId,
            },
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error("Error querying database for user");
    }
}

export const registerDeviceToUser = async (deviceToken: string, userId: string) => {
    try {
        await prisma.devices.create({
            data: {
                user_id: userId,
                device_token: deviceToken,
                updated: new Date(),
            },
        });
    } catch (error) {
        throw new Error("Error registering device");
    }
}

export const updateDeviceToken = async (deviceToken: string, userId: string) => {
    try {
        await prisma.devices.update({
            where: {
                user_id: userId,
            },
            data: {
                device_token: deviceToken,
                updated: new Date(),
            },
        });
    } catch (error) {
        throw new Error("Error updating device");
    }
}

export const getDeviceTokenByUserId = async (userId: string) => {
    try {
        const device = await prisma.devices.findUnique({
            where: { user_id: userId },
        });
        return device?.device_token;
    } catch (error) {
        throw new Error("Error getting device id by user id");
    }
}