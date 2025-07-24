import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { UserRole } from '@prisma/client';

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'redux-cms-jwt-secret-change-in-production'
);
const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// User session interface
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Authentication result interface
export interface AuthResult {
  user: UserSession;
  token: string;
  refreshToken: string;
}

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4
};

// Permission definitions
export const PERMISSIONS = {
  // Content permissions
  'content:read': [UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'content:create': [UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'content:update': [UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'content:delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'content:publish': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  
  // Media permissions
  'media:read': [UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'media:upload': [UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'media:update': [UserRole.EDITOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'media:delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  
  // User management permissions
  'users:read': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'users:create': [UserRole.SUPER_ADMIN],
  'users:update': [UserRole.SUPER_ADMIN],
  'users:delete': [UserRole.SUPER_ADMIN],
  
  // System permissions
  'system:config': [UserRole.SUPER_ADMIN],
  'system:logs': [UserRole.SUPER_ADMIN],
  'navigation:manage': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'contentTypes:manage': [UserRole.SUPER_ADMIN]
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export async function generateToken(user: Omit<UserSession, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

// Generate refresh token
export async function generateRefreshToken(userId: string): Promise<string> {
  return await new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate payload structure
    if (!payload.id || !payload.email || !payload.role) {
      return null;
    }
    
    return payload as unknown as UserSession;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Authenticate user with email and password
export async function authenticateUser(email: string, password: string): Promise<AuthResult | null> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      return null;
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    
    // Create user session
    const userSession: Omit<UserSession, 'iat' | 'exp'> = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    // Generate tokens
    const token = await generateToken(userSession);
    const refreshToken = await generateRefreshToken(user.id);
    
    return {
      user: { ...userSession, iat: 0, exp: 0 }, // iat and exp will be set by JWT
      token,
      refreshToken
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Get user from request (for API routes)
export async function getUserFromRequest(request: NextRequest): Promise<UserSession | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    return await verifyToken(token);
  } catch (error) {
    console.error('Failed to get user from request:', error);
    return null;
  }
}

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole as any);
}

// Check if user has higher or equal role
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Check if user can perform action on resource
export function canAccessResource(
  userRole: UserRole,
  permission: Permission,
  resourceOwnerId?: string,
  userId?: string
): boolean {
  // Super admin can do anything
  if (userRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Check if user has the required permission
  if (!hasPermission(userRole, permission)) {
    return false;
  }
  
  // If resource has an owner, check if user is the owner or has admin privileges
  if (resourceOwnerId && userId) {
    return resourceOwnerId === userId || hasRoleLevel(userRole, UserRole.ADMIN);
  }
  
  return true;
}

// Middleware for protecting API routes
export function createAuthMiddleware(requiredPermission?: Permission, requiredRole?: UserRole) {
  return async (request: NextRequest, response: Response) => {
    try {
      const user = await getUserFromRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Authentication required',
              code: 'UNAUTHORIZED'
            }
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check required permission
      if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Insufficient permissions',
              code: 'FORBIDDEN'
            }
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Check required role
      if (requiredRole && !hasRoleLevel(user.role, requiredRole)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Insufficient role level',
              code: 'FORBIDDEN'
            }
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Add user to request context
      (request as any).user = user;
      
      return null; // Continue to next middleware/handler
    } catch (error) {
      console.error('Auth middleware error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: 'Authentication failed',
            code: 'UNAUTHORIZED'
          }
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

// Refresh token
export async function refreshUserToken(refreshToken: string): Promise<AuthResult | null> {
  try {
    // Verify refresh token
    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
    
    if (!payload.userId || payload.type !== 'refresh') {
      return null;
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string }
    });
    
    if (!user) {
      return null;
    }
    
    // Create new user session
    const userSession: Omit<UserSession, 'iat' | 'exp'> = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    // Generate new tokens
    const newToken = await generateToken(userSession);
    const newRefreshToken = await generateRefreshToken(user.id);
    
    return {
      user: { ...userSession, iat: 0, exp: 0 },
      token: newToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// Create new user (admin only)
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) {
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.valid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }
  
  // Hash password
  const passwordHash = await hashPassword(userData.password);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: userData.email.toLowerCase(),
      passwordHash,
      name: userData.name,
      role: userData.role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });
  
  return user;
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string) {
  // Validate password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }
  
  // Hash password
  const passwordHash = await hashPassword(newPassword);
  
  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });
}

// Get user profile
export async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      lastLoginAt: true
    }
  });
}