# BangerAgent Deployment Guide

This guide covers deploying BangerAgent to production using Docker, various cloud platforms, and GitHub Actions CI/CD.

## Prerequisites

- Docker and Docker Compose installed
- Git repository access
- Cloud account (Vercel, Railway, Render, etc.)
- Docker Hub account (for image registry)

## Local Development with Docker

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/BangerAgent.git
cd BangerAgent

# Create .env file with your credentials
cp .env.example .env.local
# Edit .env.local with your API keys

# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Running Individual Services

```bash
# Frontend only
docker build -f Dockerfile.frontend -t nichelens:frontend .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key nichelens:frontend

# Backend only
cd backend
docker build -t nichelens:backend .
docker run -p 5000:5000 -e ANTHROPIC_API_KEY=your_key nichelens:backend
```

### Stopping Services

```bash
docker-compose down

# Or with volume cleanup
docker-compose down -v
```

## Cloud Deployment

### Option 1: Vercel (Recommended for Frontend)

Vercel provides the simplest deployment for the React frontend.

#### Setup

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   ```
   ANTHROPIC_API_KEY=your_key
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   ```
3. Vercel auto-detects Vite and builds accordingly
4. Deploy with: `git push origin main`

**Default Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: Vite

### Option 2: Railway (Full Stack)

Railway simplifies both frontend and backend deployment.

#### Setup

1. Sign up at railway.app
2. Create new project
3. Connect GitHub repository
4. Add services:

**Frontend Service:**
- Build command: `npm run build`
- Start command: `npm run preview`
- Port: 3000

**Backend Service:**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node server.js`
- Port: 5000

#### Environment Variables

Set in Railway dashboard:
```
# Frontend
ANTHROPIC_API_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

# Backend
ANTHROPIC_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
NODE_ENV=production
```

### Option 3: Render

Render offers good Docker support and free tier options.

#### Create Web Service

1. Go to dashboard.render.com
2. New → Web Service
3. Connect GitHub repository

**Frontend Configuration:**
- Environment: Docker
- Dockerfile path: `./Dockerfile.frontend`
- Publish port: 3000

**Backend Configuration:**
- Environment: Docker
- Dockerfile path: `./backend/Dockerfile`
- Publish port: 5000

### Option 4: Self-Hosted (VPS)

For maximum control, deploy to your own server.

#### Prerequisites

- VPS with Docker installed (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

#### Deployment Steps

```bash
# 1. SSH into your server
ssh root@your_vps_ip

# 2. Clone repository
git clone https://github.com/yourusername/BangerAgent.git
cd BangerAgent

# 3. Create .env file
nano .env
# Add your secrets

# 4. Start with Docker Compose
docker-compose up -d

# 5. Setup Nginx reverse proxy (optional but recommended)
# Configure Nginx to proxy to localhost:3000 and localhost:5000

# 6. Setup SSL with Certbot
certbot certonly --standalone -d yourdomain.com
```

## CI/CD Pipeline

BangerAgent includes GitHub Actions workflows for automated testing and deployment.

### Build Workflow (`.github/workflows/build.yml`)

Runs on every push and pull request:

- ✅ Tests Node.js compatibility (20.x, 22.x)
- ✅ Builds frontend (npm run build)
- ✅ Checks backend syntax
- ✅ Builds Docker images
- ✅ Validates docker-compose configuration
- ✅ TypeScript type checking

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on tagged releases (v*) and main branch pushes:

- 📦 Builds and pushes Docker images to Docker Hub
- 🚀 Deploys frontend to Vercel (if configured)
- 🏷️ Creates GitHub releases with release notes

### Setting Up CI/CD

1. Create GitHub repository
2. Add secrets in Settings → Secrets:
   ```
   DOCKER_USERNAME=your_docker_user
   DOCKER_PASSWORD=your_docker_token
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id
   VERCEL_PROJECT_ID=your_project_id
   ```

3. Push code to trigger workflows
4. View results in Actions tab

## Production Best Practices

### Environment Security

- Never commit `.env` files
- Use secret management for production keys
- Rotate API keys regularly
- Use environment-specific configurations

### Monitoring

```bash
# Check container health
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Monitor performance
docker stats
```

### Scaling

For high traffic, consider:

- Load balancing (Nginx, HAProxy)
- Database read replicas (Supabase)
- CDN for static assets (Vercel, Cloudflare)
- Horizontal scaling with Kubernetes

### Backup & Recovery

```bash
# Backup database
pg_dump postgres://user:password@host/db > backup.sql

# Restore from backup
psql postgres://user:password@host/db < backup.sql

# Docker volume backup
docker run --rm -v nichelens_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data
```

## Troubleshooting

### Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose up --build --no-cache
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Supabase Connection Issues

- Verify credentials in .env
- Check firewall rules
- Ensure database is running
- Review Supabase logs

### Memory Issues

```bash
# Increase Docker memory limit
# Edit docker-compose.yml:
services:
  backend:
    mem_limit: 512m
    memswap_limit: 1g
```

## Performance Optimization

### Frontend

- Enable gzip compression (Vercel does this automatically)
- Minify assets
- Use CDN for static files
- Implement lazy loading

### Backend

- Enable caching headers
- Use connection pooling for database
- Implement request compression
- Monitor API response times

## Version Management

Tag releases for easy rollback:

```bash
# Create release
git tag v1.0.0
git push origin v1.0.0

# Rollback to previous version
git checkout v0.9.0
git push -f origin v0.9.0
```

## Support & Debugging

Enable detailed logging:

```bash
# Frontend (set in .env)
DEBUG=*

# Backend
NODE_ENV=development
```

View application logs:

```bash
docker-compose logs --follow frontend
docker-compose logs --follow backend
```

## Next Steps

1. Set up monitoring (Sentry, LogRocket)
2. Configure analytics (PostHog, Mixpanel)
3. Set up automated backups
4. Create runbooks for common issues
5. Plan scaling strategy
