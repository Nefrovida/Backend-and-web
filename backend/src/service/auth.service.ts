import { prisma } from '../util/prisma';
import { hashPassword, comparePassword } from '../util/password.util';
import { generateAccessToken, generateRefreshToken } from '../util/jwt.util';
import { LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from '../types/auth.types';
import { UnauthorizedError, ConflictError } from '../util/errors.util';
import { DEFAULT_ROLES } from '../config/constants';

/**
 * Login user and generate tokens
 */
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  const { username, password } = loginData;

  // Find user with role and privileges
  const existingUser = await prisma.users.findFirst({
    where: { username, active: true },
    include: {
      role: {
        include: {
          role_privilege: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  if (!existingUser) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, existingUser.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Extract privileges
  const privileges = existingUser.role.role_privilege.map(
    (rp: { privilege: { description: string } }) => rp.privilege.description
  );

  // Create JWT payload
  const payload: JwtPayload = {
    userId: existingUser.user_id,
    roleId: existingUser.role_id,
    privileges,
  };

  // Generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      user_id: existingUser.user_id,
      name: existingUser.name,
      username: existingUser.username,
      role_id: existingUser.role_id,
    },
  };
};

/**
 * Register a new user
 */
export const register = async (registerData: RegisterRequest): Promise<AuthResponse> => {
  const { username, password, role_id, curp, speciality, license, patient_id, ...userData } = registerData;

  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: { username },
  });

  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  // Determine the actual role (default to PATIENT if not specified)
  const actualRoleId = role_id || DEFAULT_ROLES.PATIENT;

  // Validate required fields based on role
  if (actualRoleId === DEFAULT_ROLES.PATIENT && !curp) {
    throw new ConflictError('CURP is required for patient registration');
  }
  if (actualRoleId === DEFAULT_ROLES.DOCTOR && (!speciality || !license)) {
    throw new ConflictError('Speciality and license are required for doctor registration');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with default role (patient) if not specified
  const newUser = await prisma.users.create({
    data: {
      ...userData,
      username,
      password: hashedPassword,
      role_id: actualRoleId,
    },
    include: {
      role: {
        include: {
          role_privilege: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  // Create role-specific entry
  switch (actualRoleId) {
    case DEFAULT_ROLES.PATIENT:
      await prisma.patients.create({
        data: {
          user_id: newUser.user_id,
          curp: curp!,
        },
      });
      break;

    case DEFAULT_ROLES.DOCTOR:
      await prisma.doctors.create({
        data: {
          user_id: newUser.user_id,
          speciality: speciality!,
          license: license!,
        },
      });
      break;

    case DEFAULT_ROLES.LABORATORIST:
      await prisma.laboratorists.create({
        data: {
          user_id: newUser.user_id,
        },
      });
      break;

    // ADMIN role doesn't need a separate table entry
    case DEFAULT_ROLES.ADMIN:
      break;

    default:
      // If an unknown role is provided, we still allow it but don't create additional entries
      break;
  }

  // Extract privileges
  const privileges = newUser.role.role_privilege.map(
    (rp: { privilege: { description: string } }) => rp.privilege.description
  );

  // Create JWT payload
  const payload: JwtPayload = {
    userId: newUser.user_id,
    roleId: newUser.role_id,
    privileges,
  };

  // Generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      user_id: newUser.user_id,
      name: newUser.name,
      username: newUser.username,
      role_id: newUser.role_id,
    },
  };
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (userId: string): Promise<string> => {
  // Fetch user with updated role and privileges
  const user = await prisma.users.findUnique({
    where: { user_id: userId, active: true },
    include: {
      role: {
        include: {
          role_privilege: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found or inactive');
  }

  // Extract privileges
  const privileges = user.role.role_privilege.map(
    (rp: { privilege: { description: string } }) => rp.privilege.description
  );

  // Create JWT payload
  const payload: JwtPayload = {
    userId: user.user_id,
    roleId: user.role_id,
    privileges,
  };

  return generateAccessToken(payload);
};
