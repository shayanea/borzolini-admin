/**
 * Debug utility for hybrid authentication (token + cookie)
 * This can be used to test and debug authentication functionality
 */

import { environment } from '@/config/environment';
import { AuthService } from '@/services/auth.service';
import { TokenService } from '@/services/token.service';

export const debugTokenAuth = {
  /**
   * Check current authentication status (hybrid approach)
   */
  checkAuthStatus: () => {
    console.log('🔍 Hybrid Authentication Debug Information:');
    console.log('==========================================');

    const isDevelopment = environment.app.environment === 'development';
    const accessToken = TokenService.getAccessToken();
    const refreshToken = TokenService.getRefreshToken();
    const isTokenValid = TokenService.isAccessTokenValid();
    const hasTokens = TokenService.hasTokens();
    const authHeader = TokenService.getAuthorizationHeader();
    const tokenData = TokenService.getTokenData();
    const isAuthenticated = AuthService.isAuthenticated();

    console.log('Environment:', environment.app.environment);
    console.log('Development Mode:', isDevelopment);
    console.log(
      'Authentication Strategy:',
      isDevelopment ? 'Token + Cookie Hybrid' : 'Cookie Only'
    );
    console.log('---');
    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
    console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None');
    console.log('Token Valid:', isTokenValid);
    console.log('Has Tokens:', hasTokens);
    console.log('Auth Header:', authHeader);
    console.log('Token Data:', tokenData);
    console.log('Auth Service - Is Authenticated:', isAuthenticated);

    return {
      environment: environment.app.environment,
      isDevelopment,
      authStrategy: isDevelopment ? 'hybrid' : 'cookie-only',
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      isTokenValid,
      hasTokens,
      authHeader: !!authHeader,
      isAuthenticated,
    };
  },

  /**
   * Check current token status (legacy method for backward compatibility)
   */
  checkTokenStatus: () => {
    console.log('⚠️ Using legacy checkTokenStatus method. Consider using checkAuthStatus instead.');
    return debugTokenAuth.checkAuthStatus();
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
   * Monitor API requests for authentication headers (hybrid approach)
   */
  monitorApiRequests: () => {
    console.log('📡 Monitoring API Requests (Hybrid Authentication):');
    console.log('==================================================');

    const isDevelopment = environment.app.environment === 'development';
    console.log('Environment:', environment.app.environment);
    console.log('Expected Auth Strategy:', isDevelopment ? 'Token + Cookie Hybrid' : 'Cookie Only');

    // Override fetch to log requests
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const [url, options] = args;
      const headers = (options?.headers as Record<string, string>) || {};
      const urlString = typeof url === 'string' ? url : url.toString();
      const isAuthRoute = urlString.includes('/auth/');

      console.log('🌐 API Request:', {
        url: urlString,
        method: options?.method || 'GET',
        isAuthRoute,
        authStrategy: isAuthRoute
          ? 'Cookie Only'
          : isDevelopment
            ? 'Token + Cookie'
            : 'Cookie Only',
        headers: headers,
        hasAuth: !!headers.Authorization,
        authValue: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'None',
        hasCredentials: options?.credentials === 'include',
      });

      return originalFetch.apply(this, args);
    };

    console.log('✅ API request monitoring enabled');
    console.log('Make some API requests to see the authentication headers');
    console.log(
      'Auth routes will always use cookies, non-auth routes will use:',
      isDevelopment ? 'tokens + cookies' : 'cookies only'
    );
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
  (window as any).debugAuth = debugTokenAuth;
  console.log('🔧 Hybrid authentication debug tools available at window.debugAuth');
  console.log(
    'Available methods: checkAuthStatus, checkTokenStatus, testTokenStorage, monitorApiRequests, stopMonitoring'
  );
}
