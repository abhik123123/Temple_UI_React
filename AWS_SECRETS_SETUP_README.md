# AWS Secrets Manager Setup - IMPORTANT

⚠️ **NEVER commit credentials to GitHub!**

Your AWS credentials are stored in:
- Local `.env` file (in .gitignore) ✅
- AWS Secrets Manager (encrypted) ✅

For setup instructions, see the comments in:
- [backend/utils/secretsManager.js](backend/utils/secretsManager.js)
- [backend/server.js](backend/server.js)

## Quick Start

1. **Create AWS Secret**: Go to AWS Secrets Manager → Create secret named `temple-app-secrets`
2. **Add credentials**: Store your AWS keys in the secret
3. **Grant permissions**: Add `secretsmanager:GetSecretValue` to your IAM role
4. **Restart backend**: Secrets will load automatically

## Local Development

Backend automatically falls back to `.env` file if AWS Secrets Manager is not configured.

## Production Deployment

When deployed to AWS:
1. No `.env` file needed
2. Backend reads from AWS Secrets Manager
3. Credentials never exposed in code

✅ Your credentials are secure!
