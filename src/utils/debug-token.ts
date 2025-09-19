/**
 * Debug utility for token-based authentication
 * This can be used to test and debug token functionality
 */

import { TokenService } from '@/services/token.service';
import { AuthService } from '@/services/auth.service';

export const debugTokenAuth = {
  /**
   * Check current token status
   */
  checkTokenStatus: () => {
    console.log('🔍 Token Debug Information:');
    console.log('========================');

    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    const isTokenValid = TokenService.isAccessTokenValid();
    const hasTokens = TokenService.hasTokens();
    const authHeader = TokenService.getAuthorizationHeader();
    const tokenData = TokenService.getTokenData();

    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
    console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None');
    console.log('Token Valid:', isTokenValid);
    console.log('Has Tokens:', hasTokens);
    console.log('Auth Header:', authHeader);
    console.log('Token Data:', tokenData);

    const isAuthenticated = AuthService.isAuthenticated();
    console.log('Auth Service - Is Authenticated:', isAuthenticated);

    return {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      isTokenValid,
      hasTokens,
      authHeader: !!authHeader,
      isAuthenticated,
    };
  },

  /**
   * Test token storage
   */
  testTokenStorage: () => {
    console.log('🧪 Testing Token Storage:');
    console.log('========================');

    const testToken = 'test-token-12345';
    const testRefresh = 'test-refresh-67890';

    try {
      TokenService.setTokens(testToken, testRefresh, 30 * 60 * 1000);
      console.log('✅ Tokens stored successfully');

      const retrieved = TokenService.getAccessToken();
      const authHeader = TokenService.getAuthorizationHeader();

      console.log('Retrieved Token:', retrieved);
      console.log('Auth Header:', authHeader);

      const success = retrieved === testToken && authHeader === `Bearer ${testToken}`;
      console.log('Test Result:', success ? '✅ PASSED' : '❌ FAILED');

      // Clean up
      TokenService.clearTokens();
      console.log('🧹 Test tokens cleared');

      return success;
    } catch (error) {
      console.error('❌ Token storage test failed:', error);
      return false;
    }
  },

  /**
   * Monitor API requests for Authorization headers
   */
  monitorApiRequests: () => {
    console.log('📡 Monitoring API Requests:');
    console.log('===========================');

    // Override fetch to log requests
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const [url, options] = args;
      const headers = (options?.headers as Record<string, string>) || {};

      console.log('🌐 API Request:', {
        url,
        method: options?.method || 'GET',
        headers: headers,
        hasAuth: !!headers.Authorization,
        authValue: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'None',
      });

      return originalFetch.apply(this, args);
    };

    console.log('✅ API request monitoring enabled');
    console.log('Make some API requests to see the headers');
  },

  /**
   * Stop monitoring API requests
   */
  stopMonitoring: () => {
    console.log('🛑 API request monitoring disabled');
    // Note: In a real implementation, you'd want to restore the original fetch
  },
};

// Make it available in development
if (import.meta.env.DEV) {
  (window as any).debugToken = debugTokenAuth;
  console.log('🔧 Token debug tools available at window.debugToken');
}
