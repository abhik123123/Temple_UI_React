// Environment configuration - Matches Backend Authentication Strategy
const ENV = process.env.REACT_APP_ENV || 'local';

const config = {
  local: {
    env: 'local',
    apiUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:8080',
    requireAuth: false,
    authType: 'basic', // Username/Password (admin/admin123)
    useJWT: false,
    loginEndpoint: '/api/auth/login',
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
    description: 'Development - No JWT required'
  },
  dev: {
    env: 'dev',
    apiUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:8080',
    requireAuth: false,
    authType: 'basic',
    useJWT: false,
    loginEndpoint: '/api/auth/login',
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
    description: 'Dev - Basic Auth'
  },
  uat: {
    env: 'uat',
    apiUrl: 'https://uat.temple.local:3000',
    backendUrl: 'https://uat-backend.temple.local:8080',
    requireAuth: true,
    authType: 'jwt', // JWT Token Required
    useJWT: true,
    loginEndpoint: '/api/auth/login',
    tokenStorageKey: 'temple_jwt_token',
    tokenExpiryKey: 'temple_token_expiry',
    description: 'UAT - JWT Token Required'
  },
  production: {
    env: 'production',
    apiUrl: 'https://temple.com:3000',
    backendUrl: 'https://api.temple.com:8080',
    requireAuth: true,
    authType: 'jwt', // JWT Token Required (Strict)
    useJWT: true,
    loginEndpoint: '/api/auth/login',
    tokenStorageKey: 'temple_jwt_token',
    tokenExpiryKey: 'temple_token_expiry',
    description: 'Production - JWT Token Required (Strict)'
  }
};

export default config[ENV];
