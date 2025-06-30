import { NextFunction, Request, Response } from 'express';
import slugify from 'slugify';
import prisma from '../lib/db-connect';

export const getUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Destructure userData correctly from req.body
    const { firstName, lastName, email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Create name for slug, using email prefix as fallback
    const name =
      `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

    let slug = slugify(name, { lower: true, strict: true });

    // Check for existing user with the same slug
    const existingUser = await prisma.user.findUnique({ where: { slug } });

    if (existingUser) {
      const uniqueSuffix = Date.now().toString(36);
      slug = `${slug}-${uniqueSuffix}`;
    }

    const newUser = await prisma.user.create({
      data: { ...req.body, slug },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.params.email;

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: req.body,
    });

    if (user) {
      res.status(200).json({
        message: 'User updated successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.params.email;

    const user = await prisma.user.delete({
      where: {
        email,
      },
    });

    if (user) {
      res.status(200).json({
        message: 'User deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.params.email;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      res.status(200).json({
        message: 'User deleted successfully',
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, search } = req.query;

    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: { not: 'ADMIN' } },
      }),
      prisma.user.count({
        where: { role: { not: 'ADMIN' } },
      }),
    ]);
  } catch (error) {
    next(error);
  }
};
