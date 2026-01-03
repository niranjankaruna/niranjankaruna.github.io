import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LogLevel = 'info' | 'warn' | 'error' | 'event';

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  timestamp: number;
}

const MAX_BUFFER = 200;

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private buffer: LogEntry[] = [];
  private entries$ = new BehaviorSubject<LogEntry[]>([]);

  constructor() {
    // Capture global errors
    window.addEventListener('error', (e) => {
      this.error('window.error', { message: e.message, source: e.filename, line: e.lineno, col: e.colno });
    });
    window.addEventListener('unhandledrejection', (e) => {
      this.error('unhandledrejection', { reason: e.reason });
    });
  }

  stream() {
    return this.entries$.asObservable();
  }

  clear() {
    this.buffer = [];
    this.entries$.next([]);
  }

  info(message: string, data?: any, source?: string) { this.log('info', message, data, source); }
  warn(message: string, data?: any, source?: string) { this.log('warn', message, data, source); }
  error(message: string, data?: any, source?: string) { this.log('error', message, data, source); }
  event(message: string, data?: any, source?: string) { this.log('event', message, data, source); }

  private log(level: LogLevel, message: string, data?: any, source?: string) {
    const entry: LogEntry = { level, message, data, source, timestamp: Date.now() };
    this.buffer.push(entry);
    if (this.buffer.length > MAX_BUFFER) this.buffer.shift();
    this.entries$.next([...this.buffer]);

    // Mirror to console
    const prefix = `[${new Date(entry.timestamp).toISOString()}][${level}] ${source ? source + ': ' : ''}${message}`;
    if (level === 'error') console.error(prefix, data);
    else if (level === 'warn') console.warn(prefix, data);
    else console.log(prefix, data);
  }
}
