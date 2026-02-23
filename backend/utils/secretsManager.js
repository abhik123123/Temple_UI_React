const AWS = require('aws-sdk');

// Initialize Secrets Manager client
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-east-2'
});

/**
 * Retrieve secrets from AWS Secrets Manager
 * Falls back to environment variables if not available
 */
const getSecrets = async () => {
  try {
    const secretName = process.env.AWS_SECRET_NAME || 'temple-app-secrets';
    
    const data = await secretsManager.getSecretValue({
      SecretId: secretName
    }).promise();

    let secrets;
    if ('SecretString' in data) {
      secrets = JSON.parse(data.SecretString);
      console.log('✓ Secrets loaded from AWS Secrets Manager');
      return secrets;
    }
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      console.log('ℹ AWS Secrets Manager not configured, using environment variables');
    } else {
      console.warn('⚠ Error retrieving secrets:', error.message);
    }
    return null;
  }
};

const getSecret = async (key, defaultValue = null) => {
  try {
    const secrets = await getSecrets();
    if (secrets && secrets[key]) {
      return secrets[key];
    }
  } catch (error) {
    console.warn(`Could not retrieve secret ${key}`);
  }
  return process.env[key] || defaultValue;
};

module.exports = {
  getSecrets,
  getSecret,
  secretsManager
};
