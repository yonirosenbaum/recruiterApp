import type { LastContacted } from '@/types/api';

export function formatRelativeContacted(at: string, now = Date.now()): string {
  const ms = now - new Date(at).getTime();
  const minutes = Math.max(0, Math.floor(ms / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatContactedLabel(last: LastContacted, now = Date.now()): string {
  const first = last.byName.trim().split(/\s+/)[0] || last.byName;
  return `Contacted · ${first} · ${formatRelativeContacted(last.at, now)}`;
}
