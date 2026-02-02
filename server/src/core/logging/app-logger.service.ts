import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

type LogMeta = Record<string, unknown>;

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  customLog(message: string, meta?: LogMeta): string {
    if (!meta || Object.keys(meta).length === 0) return message;
    return `${message} | meta=${this.safeStringify(meta)}`;
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return '[unserializable-meta]';
    }
  }
}
