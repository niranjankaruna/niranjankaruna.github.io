import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggingService } from './logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  const started = performance.now();
  logger.event('http:start', { url: req.url, method: req.method }, 'http');

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        logger.info('http:success', {
          url: req.url,
          method: req.method,
          status: event.status,
          durationMs: Math.round(performance.now() - started)
        }, 'http');
      }
    }),
    catchError(err => {
      logger.error('http:error', {
        url: req.url,
        method: req.method,
        status: err?.status,
        message: err?.message
      }, 'http');
      return throwError(() => err);
    }),
    finalize(() => {
      logger.event('http:done', {
        url: req.url,
        method: req.method,
        durationMs: Math.round(performance.now() - started)
      }, 'http');
    })
  );
};
