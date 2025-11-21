import EventEmitter from 'eventemitter3';

// Create a singleton event emitter instance
const eventEmitter = new EventEmitter();

// Event types
export const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
  REDIRECT: 'auth:redirect',
} as const;

// Export the event emitter instance
export { eventEmitter };

// Type-safe event emitter methods
export const emitAuthUnauthorized = () => eventEmitter.emit(AUTH_EVENTS.UNAUTHORIZED);
export const emitAuthRedirect = (path: string) => eventEmitter.emit(AUTH_EVENTS.REDIRECT, { path });

// Subscribe to events
export const onAuthUnauthorized = (callback: () => void) =>
  eventEmitter.on(AUTH_EVENTS.UNAUTHORIZED, callback);
export const onAuthRedirect = (callback: (data: { path: string }) => void) =>
  eventEmitter.on(AUTH_EVENTS.REDIRECT, callback);

// Unsubscribe from events
export const offAuthUnauthorized = (callback: () => void) =>
  eventEmitter.off(AUTH_EVENTS.UNAUTHORIZED, callback);
export const offAuthRedirect = (callback: (data: { path: string }) => void) =>
  eventEmitter.off(AUTH_EVENTS.REDIRECT, callback);
