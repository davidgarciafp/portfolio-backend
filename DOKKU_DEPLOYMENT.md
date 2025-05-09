# Deploying Flask Backend to Dokku

This guide explains how to deploy your Flask contact form backend to Dokku.

## Prerequisites

1. A server with Dokku installed
2. SSH access to the server
3. Git installed on your local machine

## Setup Steps

### 1. Create the app on your Dokku server

SSH into your Dokku server and create a new app:

```bash
dokku apps:create portfolio-backend
```

### 2. Configure environment variables

Set the required environment variables:

```bash
dokku config:set portfolio-backend EMAIL_HOST=smtp.gmail.com
dokku config:set portfolio-backend EMAIL_PORT=587
dokku config:set portfolio-backend EMAIL_USER=your-email@gmail.com
dokku config:set portfolio-backend EMAIL_PASSWORD=your-app-password
dokku config:set portfolio-backend EMAIL_RECIPIENT=davidgf444@gmail.com
```

### 3. Add a domain (optional)

If you want to use a custom domain:

```bash
dokku domains:add portfolio-backend api.yourdomain.com
```

### 4. Deploy from your local machine

Add the Dokku server as a Git remote and push your code:

```bash
# In your local repository
git remote add dokku dokku@your-server-ip:portfolio-backend
git add .
git commit -m "Prepare for Dokku deployment"
git push dokku main
```

### 5. SSL Setup (optional but recommended)

To enable HTTPS with Let's Encrypt:

```bash
dokku letsencrypt:enable portfolio-backend
```

## Troubleshooting

### Checking logs

If you encounter issues, check the logs:

```bash
dokku logs portfolio-backend -t
```

### Restarting the app

If needed, restart the application:

```bash
dokku ps:restart portfolio-backend
```

## Updating the application

To update your application, simply push to the Dokku remote:

```bash
git add .
git commit -m "Update application"
git push dokku main
```