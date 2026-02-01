# AWS Deployment Guide - Temple React Application

## 📋 Overview

This guide covers deploying the Temple React application to AWS, including:
- **Frontend:** React application → AWS S3 + CloudFront
- **Backend:** Node.js/Express API → AWS EC2 or Elastic Beanstalk
- **Database:** PostgreSQL → AWS RDS
- **File Storage:** Image uploads → AWS S3

---

## 🎯 Architecture Overview

```
Users → CloudFront (CDN) → S3 (React App)
         ↓
Users → API Gateway/ALB → EC2/Elastic Beanstalk (Backend API)
         ↓
         RDS (PostgreSQL Database)
         ↓
         S3 (Image Storage)
```

---

## ✅ Prerequisites

### 1. AWS Account Setup
- [ ] Create AWS account at https://aws.amazon.com
- [ ] Set up billing alerts
- [ ] Create IAM user with appropriate permissions
- [ ] Install AWS CLI: `aws configure`

### 2. Local Requirements
- [ ] Node.js 16+ installed
- [ ] AWS CLI installed
- [ ] Git installed
- [ ] Backend code ready (Node.js + Express)

### 3. Domain (Optional)
- [ ] Purchase domain (Route 53 or external)
- [ ] Configure DNS settings

---

## 🗄️ PART 1: Database Setup (AWS RDS)

### Step 1.1: Create PostgreSQL Database

1. **Navigate to RDS Console:**
   - Go to AWS Console → Services → RDS
   - Click "Create database"

2. **Database Configuration:**
   ```
   Engine: PostgreSQL
   Version: PostgreSQL 15.x (latest)
   Template: Free tier (for testing) OR Production
   
   DB Instance Identifier: temple-db
   Master Username: templeadmin
   Master Password: [Create strong password]
   
   DB Instance Class: db.t3.micro (free tier) or db.t3.small
   Storage: 20 GB (General Purpose SSD)
   Enable Storage Autoscaling: Yes
   ```

3. **Connectivity Settings:**
   ```
   VPC: Default VPC
   Public Access: Yes (for initial setup, restrict later)
   VPC Security Group: Create new "temple-db-sg"
   Availability Zone: No preference
   Port: 5432
   ```

4. **Additional Configuration:**
   ```
   Initial Database Name: temple_db
   Backup Retention: 7 days
   Enable Enhanced Monitoring: Yes
   ```

5. **Click "Create database"** (takes 5-10 minutes)

### Step 1.2: Configure Security Group

1. Go to EC2 → Security Groups
2. Find "temple-db-sg"
3. Add Inbound Rule:
   ```
   Type: PostgreSQL
   Protocol: TCP
   Port: 5432
   Source: Your IP (for testing)
   Source: EC2 Security Group (for production)
   ```

### Step 1.3: Note Database Endpoint

1. RDS → Databases → temple-db
2. Copy the **Endpoint** (e.g., `temple-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Save this for backend configuration

### Step 1.4: Initialize Database Schema

Connect using a PostgreSQL client:
```bash
psql -h temple-db.xxxxx.us-east-1.rds.amazonaws.com -U templeadmin -d temple_db
```

Run your database schema creation scripts.

---

## 🖥️ PART 2: Backend Deployment (EC2 or Elastic Beanstalk)

### Option A: EC2 (Manual Control)

#### Step 2A.1: Launch EC2 Instance

1. **Navigate to EC2 Console:**
   - AWS Console → EC2 → Launch Instance

2. **Configure Instance:**
   ```
   Name: temple-backend
   AMI: Amazon Linux 2023 or Ubuntu 22.04
   Instance Type: t2.micro (free tier) or t2.small
   Key Pair: Create new or use existing
   
   Network Settings:
   - Create security group "temple-backend-sg"
   - Allow SSH (22) from My IP
   - Allow HTTP (80) from Anywhere
   - Allow HTTPS (443) from Anywhere
   - Allow Custom TCP (5000) from Anywhere [API port]
   ```

3. **Storage:** 8-20 GB (default is fine)

4. **Click "Launch Instance"**

#### Step 2A.2: Connect to EC2 Instance

```bash
# Windows (use Git Bash or PowerShell)
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip

# Or use EC2 Instance Connect from AWS Console
```

#### Step 2A.3: Install Dependencies on EC2

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs  # Amazon Linux
# OR
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs  # Ubuntu

# Install Git
sudo yum install git -y  # Amazon Linux
# OR
sudo apt install git -y  # Ubuntu

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo yum install nginx -y  # Amazon Linux
# OR
sudo apt install nginx -y  # Ubuntu
```

#### Step 2A.4: Deploy Backend Code

```bash
# Clone your repository
cd /home/ec2-user
git clone https://github.com/your-username/temple-backend.git
cd temple-backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Backend .env Configuration:**
```env
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://templeadmin:yourpassword@temple-db.xxxxx.us-east-1.rds.amazonaws.com:5432/temple_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_S3_BUCKET=temple-uploads
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

#### Step 2A.5: Start Backend with PM2

```bash
# Start the application
pm2 start index.js --name temple-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs temple-api
```

#### Step 2A.6: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/conf.d/temple-api.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Or your EC2 public IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Start Nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

#### Step 2A.7: Test Backend

```bash
# From your local machine
curl http://your-ec2-public-ip/api/health
# Should return API health status
```

---

### Option B: Elastic Beanstalk (Easier, Managed)

#### Step 2B.1: Install EB CLI

```bash
pip install awsebcli --upgrade --user
```

#### Step 2B.2: Initialize Elastic Beanstalk

```bash
cd backend
eb init

# Answer prompts:
# Region: us-east-1 (or your preference)
# Application name: temple-backend
# Platform: Node.js
# Platform version: Node.js 18 (latest)
# SSH: Yes
```

#### Step 2B.3: Create Environment

```bash
eb create temple-backend-prod

# This will:
# - Create load balancer
# - Create EC2 instances
# - Configure auto-scaling
# - Set up security groups
```

#### Step 2B.4: Configure Environment Variables

```bash
eb setenv \
  NODE_ENV=production \
  DATABASE_URL=postgresql://templeadmin:pass@temple-db.xxxxx.us-east-1.rds.amazonaws.com:5432/temple_db \
  JWT_SECRET=your_secret \
  AWS_S3_BUCKET=temple-uploads
```

#### Step 2B.5: Deploy Backend

```bash
eb deploy

# Check status
eb status
eb logs
```

#### Step 2B.6: Open Application

```bash
eb open
# Opens your backend URL in browser
```

---

## 📦 PART 3: S3 Bucket for File Uploads

### Step 3.1: Create S3 Bucket for Uploads

1. **Navigate to S3 Console**
2. **Click "Create bucket"**
   ```
   Bucket name: temple-uploads-[unique-id]
   Region: us-east-1 (same as backend)
   Block Public Access: Uncheck (we'll use bucket policy)
   Versioning: Enable
   Encryption: Enable (SSE-S3)
   ```

### Step 3.2: Configure Bucket Policy

Go to bucket → Permissions → Bucket Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::temple-uploads-[unique-id]/*"
    }
  ]
}
```

### Step 3.3: Enable CORS

Go to bucket → Permissions → CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-frontend-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Step 3.4: Create IAM User for S3 Access

1. IAM → Users → Create user
2. User name: `temple-s3-uploader`
3. Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Create access key → Save credentials

---

## 🌐 PART 4: Frontend Deployment (S3 + CloudFront)

### Step 4.1: Build React Application

```bash
cd c:\Users\FDUSC00090\Temple-UI

# Create production .env
# Create .env.production
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

Build the application:
```bash
npm run build
```

This creates a `build/` folder with optimized production files.

### Step 4.2: Create S3 Bucket for Frontend

1. **Navigate to S3 Console**
2. **Click "Create bucket"**
   ```
   Bucket name: temple-frontend-[unique-id]
   Region: us-east-1
   Block Public Access: Keep checked (CloudFront will access it)
   Versioning: Enable
   ```

### Step 4.3: Upload Build Files to S3

**Using AWS Console:**
1. Open bucket → Upload
2. Drag all files from `build/` folder
3. Click Upload

**Using AWS CLI:**
```bash
aws s3 sync build/ s3://temple-frontend-[unique-id]/ --delete
```

### Step 4.4: Configure S3 Bucket for Static Hosting

1. Go to bucket → Properties
2. Scroll to "Static website hosting"
3. Enable static website hosting
   ```
   Index document: index.html
   Error document: index.html (for React Router)
   ```
4. Save - note the bucket website endpoint

### Step 4.5: Create CloudFront Distribution

1. **Navigate to CloudFront Console**
2. **Click "Create Distribution"**

3. **Origin Settings:**
   ```
   Origin Domain: temple-frontend-[unique-id].s3.amazonaws.com
   Name: Temple-Frontend-S3
   Origin Access: Origin Access Control (OAC) - Create new
   ```

4. **Default Cache Behavior:**
   ```
   Viewer Protocol Policy: Redirect HTTP to HTTPS
   Allowed HTTP Methods: GET, HEAD, OPTIONS
   Cache Policy: CachingOptimized
   ```

5. **Distribution Settings:**
   ```
   Price Class: Use all edge locations (or select based on geography)
   Alternate Domain Names (CNAMEs): www.yourdomain.com, yourdomain.com
   SSL Certificate: Request or import certificate
   Default Root Object: index.html
   ```

6. **Custom Error Responses** (for React Router):
   - Error Code: 403
   - Response Page Path: /index.html
   - HTTP Response Code: 200
   
   - Error Code: 404
   - Response Page Path: /index.html
   - HTTP Response Code: 200

7. **Click "Create Distribution"** (takes 10-20 minutes to deploy)

### Step 4.6: Update S3 Bucket Policy for CloudFront

After CloudFront creates OAC, copy the policy provided and add to S3 bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": {
      "Service": "cloudfront.amazonaws.com"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::temple-frontend-[unique-id]/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
      }
    }
  }
}
```

---

## 🌍 PART 5: Domain & SSL Setup

### Step 5.1: Request SSL Certificate (ACM)

1. **Navigate to Certificate Manager** (in us-east-1 for CloudFront)
2. **Click "Request certificate"**
   ```
   Certificate Type: Public certificate
   Domain names:
   - yourdomain.com
   - *.yourdomain.com
   
   Validation: DNS validation
   ```

3. **Validate Domain:**
   - Add CNAME records to your DNS (Route 53 or your provider)
   - Wait for validation (5-30 minutes)

### Step 5.2: Configure Route 53 (if using AWS DNS)

1. **Create Hosted Zone:**
   - Route 53 → Hosted Zones → Create
   - Domain name: yourdomain.com

2. **Update Name Servers:**
   - Copy NS records
   - Update at your domain registrar

3. **Create Record for Frontend:**
   ```
   Record name: (blank for root) or www
   Type: A - IPv4 address
   Alias: Yes
   Route traffic to: CloudFront distribution
   Distribution: Select your distribution
   ```

4. **Create Record for Backend:**
   ```
   Record name: api
   Type: A - IPv4 address
   Alias: Yes (if using ALB) or No (if using EC2 IP)
   Value: Your backend endpoint
   ```

### Step 5.3: Update CloudFront with SSL

1. CloudFront → Your Distribution → Edit
2. Alternate Domain Names: Add yourdomain.com, www.yourdomain.com
3. SSL Certificate: Select your ACM certificate
4. Save changes

---

## 🔒 PART 6: Security Best Practices

### 6.1: EC2 Security

```bash
# On EC2 instance:
# Update security group to only allow:
# - SSH from your IP only
# - HTTP/HTTPS from Load Balancer security group only

# Enable automatic security updates
sudo yum update -y --security  # Amazon Linux
```

### 6.2: RDS Security

1. Security Group: Only allow 5432 from backend security group
2. Disable public access after initial setup
3. Enable encryption at rest
4. Regular automated backups

### 6.3: S3 Security

1. Enable versioning
2. Enable server-side encryption
3. Use bucket policies, not ACLs
4. Enable logging
5. Regular access audits

### 6.4: Application Security

- Use strong JWT secrets
- Enable HTTPS only
- Set secure CORS policies
- Implement rate limiting
- Regular dependency updates
- Use AWS Secrets Manager for sensitive data

---

## 📊 PART 7: Monitoring & Logging

### 7.1: CloudWatch Setup

1. **EC2 Metrics:**
   - Enable detailed monitoring
   - Create alarms for CPU, Memory, Disk

2. **RDS Monitoring:**
   - Enable Enhanced Monitoring
   - Set up alarms for connections, CPU

3. **CloudFront Metrics:**
   - Monitor requests, error rates
   - Set up alerts for 4xx/5xx errors

### 7.2: Application Logs

```bash
# Backend logs with PM2
pm2 logs temple-api

# Or check CloudWatch Logs
# Install CloudWatch agent on EC2
```

---

## 🔄 PART 8: CI/CD Pipeline (Optional but Recommended)

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: temple-backend
          environment_name: temple-backend-prod
          version_label: ${{ github.sha }}
          region: us-east-1
          deployment_package: backend.zip

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build React App
        run: |
          npm ci
          npm run build
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: temple-frontend-unique-id
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: us-east-1
          SOURCE_DIR: build
      - name: Invalidate CloudFront
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          DISTRIBUTION: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
          PATHS: '/*'
          AWS_REGION: us-east-1
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## 💰 PART 9: Cost Optimization

### Estimated Monthly Costs (Low Traffic):

```
RDS (db.t3.micro):        ~$15-20
EC2 (t2.small):           ~$15-20
S3 Storage (10GB):        ~$0.23
CloudFront (100GB):       ~$8.50
Route 53 (1 hosted zone): ~$0.50
------------------------------------
Total:                    ~$40-50/month
```

### Cost Saving Tips:
1. Use Reserved Instances for production (40-60% savings)
2. Enable S3 Lifecycle policies
3. Use CloudFront caching effectively
4. Set up auto-scaling for backend
5. Use AWS Free Tier where available

---

## ✅ PART 10: Deployment Checklist

### Pre-Deployment:
- [ ] Backend code tested locally
- [ ] Frontend builds successfully
- [ ] Database schema finalized
- [ ] Environment variables documented
- [ ] SSL certificates ready

### AWS Resources:
- [ ] RDS PostgreSQL database created
- [ ] EC2/Elastic Beanstalk backend deployed
- [ ] S3 bucket for uploads configured
- [ ] S3 bucket for frontend created
- [ ] CloudFront distribution created
- [ ] Route 53 domain configured
- [ ] SSL certificates issued and attached

### Security:
- [ ] Security groups properly configured
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Secrets stored in environment variables
- [ ] Database not publicly accessible

### Post-Deployment:
- [ ] Test all API endpoints
- [ ] Test frontend functionality
- [ ] Test file uploads
- [ ] Test authentication
- [ ] Set up monitoring and alerts
- [ ] Document deployed endpoints

---

## 🚀 Quick Deployment Commands

### Backend Update (EC2):
```bash
ssh -i your-key.pem ec2-user@your-ip
cd temple-backend
git pull
npm install
pm2 restart temple-api
```

### Frontend Update:
```bash
# Local machine
npm run build
aws s3 sync build/ s3://temple-frontend-[id]/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 📞 Troubleshooting

### Backend Issues:
```bash
# Check logs
pm2 logs temple-api

# Restart service
pm2 restart temple-api

# Check if port is listening
netstat -tulpn | grep 5000
```

### Frontend Issues:
- Check CloudFront error logs
- Verify S3 bucket policy
- Check browser console for CORS errors
- Ensure API_BASE_URL is correct

### Database Connection Issues:
- Verify security group rules
- Check database endpoint
- Test connection: `psql -h endpoint -U user -d db`
- Verify credentials

---

## 📚 Additional Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Last Updated:** January 31, 2026
**Version:** 1.0
**Application:** Temple React Application
