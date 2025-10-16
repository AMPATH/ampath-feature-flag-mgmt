import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionUtils } from "../services/utils/sessions.utils";

export function AppHttpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    if (!req.url.includes("login")) {
        console.log("ok");
        const sessionUtils = inject(SessionUtils);
        const access_token = sessionUtils.getSession().access_token;

        const reqWithAuthorization = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${access_token}`)
        });

        return next(reqWithAuthorization);
    }
    return next(req);
}