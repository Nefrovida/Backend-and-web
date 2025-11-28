import { prisma } from '../util/prisma.js';
import { hashPassword, comparePassword } from '../util/password.util';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../util/jwt.util';
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
    where: { username },
    include: {
      role: {
        include: {
          role_privileges: {
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

  // Check if user is approved
  if (existingUser.user_status !== 'APPROVED' || !existingUser.active) {
    throw new UnauthorizedError('Your account is pending admin approval or has been deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, existingUser.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Extract privileges
  const privileges = existingUser.role.role_privileges.map(
    (rp) => rp.privilege.description
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
  const { username, password, role_id, curp, specialty, license, patient_curp, ...userData } = registerData;

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
  if (actualRoleId === DEFAULT_ROLES.DOCTOR && (!specialty || !license)) {
    throw new ConflictError('specialty and license are required for doctor registration');
  }
  if (actualRoleId === DEFAULT_ROLES.FAMILIAR && !patient_curp) {
    throw new ConflictError('Patient CURP is required for familiar registration');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Convert birthday to Date if it's a string
  const birthdayDate = userData.birthday ? new Date(userData.birthday) : new Date();

  // Create user with PENDING status (awaiting admin approval)
  const newUser = await prisma.users.create({
    data: {
      ...userData,
      birthday: birthdayDate,
      username,
      password: hashedPassword,
      role_id: actualRoleId,
      first_login: true,
      user_status: 'PENDING',
      active: false,
    },
    include: {
      role: {
        include: {
          role_privileges: {
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
          specialty: specialty!,
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

    case DEFAULT_ROLES.FAMILIAR:
      // Look up patient by CURP
      const patient = await prisma.patients.findUnique({
        where: { curp: patient_curp! },
      });
      
      if (!patient) {
        throw new ConflictError('Patient with provided CURP not found');
      }
      
      await prisma.familiars.create({
        data: {
          user_id: newUser.user_id,
          patient_id: patient.patient_id,
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

  // Return user data without tokens - user must wait for admin approval
  return {
    accessToken: '',
    refreshToken: '',
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
export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; user: { user_id: string; name: string; username: string; role_id: string } }> => {
  // Verify the refresh token
  let decoded: JwtPayload;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Fetch user with updated role and privileges
  const user = await prisma.users.findUnique({
    where: { user_id: decoded.userId },
    include: {
      role: {
        include: {
          role_privileges: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  if (!user || user.user_status !== 'APPROVED' || !user.active) {
    throw new UnauthorizedError('User not found, inactive, or not approved');
  }

  // Extract privileges
  const privileges = user.role.role_privileges.map(
    (rp) => rp.privilege.description
  );

  // Create JWT payload
  const payload: JwtPayload = {
    userId: user.user_id,
    roleId: user.role_id,
    privileges,
  };

  return {
    accessToken: generateAccessToken(payload),
    user: {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      role_id: user.role_id,
    },
  };
};
