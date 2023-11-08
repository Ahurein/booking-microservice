import { CanActivate, ExecutionContext, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { UserDto } from "../dto";
import { Reflector } from "@nestjs/core";

export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name)

    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication || context.switchToHttp().getRequest().headers?.authentication
        if (!jwt) {
            return false
        }

        const roles = this.reflector.get<string[]>("roles", context.getHandler())
        return this.authClient.send<UserDto>("authenticate", {
            Authentication: jwt
        }).pipe(
            tap(res => {
                if (roles) {
                    for (const role of roles) {
                        if (!res.roles?.some(userRole => userRole.toLowerCase().includes(role.toLowerCase()))) {
                            this.logger.error("User does not have valid roles")
                            throw new UnauthorizedException();
                        }
                    }
                }
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError((err) => {
                this.logger.error(err)
                return of(false)
            })
        )
    }

}