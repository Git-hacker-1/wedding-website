import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      guestGroupId?: string;
    }
  }
}

export function guestIdentityMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const groupId = req.headers["x-guest-group-id"];

  if (typeof groupId === "string" && groupId.length > 0) {
    req.guestGroupId = groupId;

    Sentry.setUser({ id: groupId });
  }

  next();
}
