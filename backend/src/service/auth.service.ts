import { prisma } from '../util/prisma';
import { hashPassword, comparePassword } from '../util/password.util';
import { generateAccessToken, generateRefreshToken } from '../util/jwt.util';
import { LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from '../types/auth.types';
import { UnauthorizedError, BadRequestError, ConflictError } from '../util/errors.util';
import { DEFAULT_ROLES } from '../config/constants';

/**
 * Login user and generate tokens
 */
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  const { user, password } = loginData;

  // Find user with role and privileges
  const existingUser = await prisma.users.findFirst({
    where: { user, active: true },
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
      user: existingUser.user,
      role_id: existingUser.role_id,
    },
  };
};

/**
 * Register a new user
 */
export const register = async (registerData: RegisterRequest): Promise<AuthResponse> => {
  const { user, password, role_id, ...userData } = registerData;

  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: { user },
  });

  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with default role (patient) if not specified
  const newUser = await prisma.users.create({
    data: {
      ...userData,
      user,
      password: hashedPassword,
      role_id: role_id || DEFAULT_ROLES.PATIENT,
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
      user: newUser.user,
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
