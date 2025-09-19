/**
 * Token Management Service
 * Handles localStorage-based token storage and retrieval for cross-machine authentication
 */

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'borzolini_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'borzolini_refresh_token';
  private static readonly TOKEN_EXPIRY_KEY = 'borzolini_token_expiry';

  /**
   * Store tokens in localStorage
   */
  static setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number = 30 * 60 * 1000
  ): void {
    try {
      const expiresAt = Date.now() + expiresIn;

      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiresAt.toString());

      console.log('TokenService: Tokens stored successfully');
    } catch (error) {
      console.error('TokenService: Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get access token from localStorage
   */
  static getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('TokenService: Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from localStorage
   */
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('TokenService: Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Get all token data
   */
  static getTokenData(): TokenData | null {
    try {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      const expiresAtStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

      const hasAccessToken = !!accessToken;
      const hasRefreshToken = !!refreshToken;
      const hasExpiryStr = !!expiresAtStr;

      if (!hasAccessToken) return null;
      if (!hasRefreshToken) return null;
      if (!hasExpiryStr) return null;

      return {
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAtStr, 10),
      };
    } catch (error) {
      console.error('TokenService: Failed to get token data:', error);
      return null;
    }
  }

  /**
   * Check if access token is valid (not expired)
   */
  static isAccessTokenValid(): boolean {
    try {
      const expiresAtStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiresAtStr) {
        return false;
      }

      const expiresAt = parseInt(expiresAtStr, 10);
      const now = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      const isValid = now < expiresAt - bufferTime;

      return isValid;
    } catch (error) {
      console.error('TokenService: Failed to check token validity:', error);
      return false;
    }
  }

  /**
   * Clear all tokens from localStorage
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

      console.log('TokenService: Tokens cleared successfully');
    } catch (error) {
      console.error('TokenService: Failed to clear tokens:', error);
    }
  }

  /**
   * Check if user has any stored tokens
   */
  static hasTokens(): boolean {
    return this.getAccessToken() !== null && this.getRefreshToken() !== null;
  }

  /**
   * Get Authorization header value
   */
  static getAuthorizationHeader(): string | null {
    const accessToken = this.getAccessToken();
    return accessToken ? `Bearer ${accessToken}` : null;
  }
}

export default TokenService;
