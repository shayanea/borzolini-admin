/**
 * JWT Utility Functions
 * Provides safe JWT token decoding and validation
 */

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

/**
 * Safely decode a JWT token payload without verification
 * Note: This is for reading expiration time only, not for authentication
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format: token must have 3 parts');
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload) as JWTPayload;

    return parsedPayload;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Get the expiration time from a JWT token in milliseconds
 */
export function getJWTExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  // Convert Unix timestamp to milliseconds
  return payload.exp * 1000;
}

/**
 * Check if a JWT token is expired
 */
export function isJWTExpired(token: string, bufferTimeMs: number = 0): boolean {
  const expirationTime = getJWTExpiration(token);
  if (!expirationTime) {
    return true; // Consider invalid tokens as expired
  }

  const now = Date.now();
  return now >= expirationTime - bufferTimeMs;
}

/**
 * Get time until JWT token expires in milliseconds
 */
export function getTimeUntilJWTExpiration(token: string): number | null {
  const expirationTime = getJWTExpiration(token);
  if (!expirationTime) {
    return null;
  }

  const now = Date.now();
  return Math.max(0, expirationTime - now);
}

/**
 * Check if JWT token will expire within specified time
 */
export function willJWTExpireSoon(token: string, withinMs: number = 5 * 60 * 1000): boolean {
  const timeUntilExpiration = getTimeUntilJWTExpiration(token);
  if (timeUntilExpiration === null) {
    return true; // Consider invalid tokens as expiring soon
  }

  return timeUntilExpiration <= withinMs;
}
