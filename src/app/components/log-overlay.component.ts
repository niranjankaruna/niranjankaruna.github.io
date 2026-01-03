import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LoggingService, LogEntry } from '../services/logging.service';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-log-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="log-toggle" (click)="toggle()">Logs</div>
    <section class="log-panel" *ngIf="open()">
      <header>
        <strong>Logs</strong>
        <button type="button" (click)="clear()">Clear</button>
        <button type="button" (click)="toggle()">Close</button>
      </header>
      <div class="log-body">
        <div *ngFor="let entry of entries()" [class]="'lvl-' + entry.level">
          <span class="ts">{{ entry.timestamp | date:'mediumTime' }}</span>
          <span class="lvl">{{ entry.level }}</span>
          <span class="msg">{{ entry.message }}</span>
          <span class="src" *ngIf="entry.source">({{ entry.source }})</span>
          <pre *ngIf="entry.data" class="data">{{ entry.data | json }}</pre>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-family: Inter, system-ui, sans-serif; }
    .log-toggle { background:#111827; color:#e5e7eb; padding:8px 10px; border-radius:6px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.25); user-select:none; }
    .log-panel { width: 420px; max-height: 60vh; background:#0b0f19; color:#e5e7eb; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.35); overflow:hidden; }
    header { display:flex; gap:8px; align-items:center; padding:10px 12px; background:#111827; border-bottom:1px solid #1f2937; }
    header button { background:#1f2937; color:#e5e7eb; border:1px solid #374151; padding:4px 8px; border-radius:6px; cursor:pointer; }
    .log-body { max-height:50vh; overflow:auto; padding:10px 12px; display:flex; flex-direction:column; gap:6px; }
    .log-body div { font-size: 12px; line-height: 1.4; padding:6px 8px; border-radius:6px; background:#111827; border:1px solid #1f2937; }
    .ts { color:#9ca3af; margin-right:6px; }
    .lvl { text-transform:uppercase; margin-right:6px; }
    .lvl-info { color:#22d3ee; }
    .lvl-warn { color:#fbbf24; }
    .lvl-error { color:#f87171; }
    .lvl-event { color:#a78bfa; }
    .msg { color:#e5e7eb; }
    .src { color:#9ca3af; margin-left:6px; }
    .data { margin:4px 0 0; background:#0b0f19; border:1px solid #1f2937; padding:6px; border-radius:4px; white-space:pre-wrap; }
  `]
})
export class LogOverlayComponent {
  private openState = signal(false);
  private entriesSignal = toSignal(this.logger.stream().pipe(map(entries => [...entries].reverse())), { initialValue: [] as LogEntry[] });

  constructor(private readonly logger: LoggingService) {}

  open = this.openState.asReadonly();
  entries = computed(() => this.entriesSignal());

  toggle() { this.openState.update(v => !v); }
  clear() { this.logger.clear(); }
}
