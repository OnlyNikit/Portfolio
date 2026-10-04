import { Router } from 'express';
import type { Request, Response } from 'express';
import { generateToken, requireAdmin, type AuthRequest } from '../middleware/auth.ts';

export const authRouter = Router();

/**
 * Read admin credentials from environment variables.
 *
 * Render:
 * ADMIN_EMAIL=your-admin-email
 * ADMIN_PASSWORD=your-admin-password
 */
function getAdminCredentials() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD are not configured.'
    );
  }

  return {
    email: adminEmail,
    password: adminPassword,
  };
}

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const admin = getAdminCredentials();

    const isEmailMatch =
      email.trim().toLowerCase() === admin.email;

    const isPasswordMatch =
      password === admin.password;

    if (!isEmailMatch || !isPasswordMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify email and password.',
      });
      return;
    }

    const token = generateToken({
      email: admin.email,
      role: 'admin',
    });

    // HTTP-only authentication cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// ============================================================
// LOGOUT
// POST /api/auth/logout
// ============================================================

authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ============================================================
// CURRENT SESSION
// GET /api/auth/me
// ============================================================

authRouter.get(
  '/me',
  requireAdmin,
  (req: AuthRequest, res: Response) => {
    res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  }
);

// ============================================================
// CHANGE PASSWORD
// POST /api/auth/change-password
// ============================================================

authRouter.post(
  '/change-password',
  requireAdmin,
  (req: AuthRequest, res: Response) => {
    res.status(501).json({
      success: false,
      error:
        'Password change is disabled for environment-based admin authentication. Update ADMIN_PASSWORD in your environment variables.',
    });
  }
);