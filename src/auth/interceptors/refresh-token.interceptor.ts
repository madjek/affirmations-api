import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      catchError((err) => {
        if (
          err instanceof UnauthorizedException &&
          err.message === 'Unauthorized'
        ) {
          const refreshToken =
            req.headers['x-refresh-token'] || req.cookies?.refreshToken;

          if (!refreshToken) {
            return throwError(() => err);
          }

          return from(this.authService.refresh(refreshToken as string)).pipe(
            mergeMap((tokens) => {
              res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);

              return from([
                {
                  refreshed: true,
                  accessToken: tokens.accessToken,
                  refreshToken: tokens.refreshToken,
                },
              ]);
            }),
            catchError((refreshError) => throwError(() => refreshError)),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
