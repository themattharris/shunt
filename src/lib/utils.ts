import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainFromRequest(req: Request) {
  return resolveDevHostname(new URL(req.url).hostname);
}

export function resolveDevHostname(hostname: string) {
  if (hostname.split(':')[0] === 'localhost') {
    return 'shunt.to';
  }
  return hostname;
}
