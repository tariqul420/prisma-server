import { NextFunction, Request, Response } from 'express';
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
    const newUser = await prisma.user.create({
      data: req.body,
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

    const users = await prisma.user.findMany({
      where: { role: { not: 'ADMIN' } },
    });
  } catch (error) {
    next(error);
  }
};
