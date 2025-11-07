import { Request, Response, NextFunction } from "express";
import "../types/session.d.ts";

function getPermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        next()
        // TODO: Incorporate RBAC
        return;
        if (req.session?.permissions?.includes(permission)) {
            next()
        }
        else {
            res.redirect("/401")
        }
    }
}

export default getPermission;