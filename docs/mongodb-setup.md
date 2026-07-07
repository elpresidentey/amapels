# MongoDB Atlas Setup Guide

## Why You Need This
Your app currently uses `mongodb://localhost:27017` which only works on your local machine. For production (Vercel), you need a cloud database.

## Quick Setup (5 minutes)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card required)
3. Create a free M0 cluster (512 MB storage - perfect for starting)

### 2. Configure Database Access
1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Create a username and strong password (save these!)
4. Set privileges to **Read and write to any database**

### 3. Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is safe because you have username/password authentication

### 4. Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/amapels?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your actual credentials
5. Replace the database name (after `.net/`) with `amapels`

### 5. Add to Vercel
```bash
vercel env add MONGODB_URI production
```
When prompted, paste your full connection string.

### 6. Redeploy
```bash
vercel --prod
```

## Example Connection String
```
mongodb+srv://amapels-user:SecureP@ssw0rd@cluster0.abc123.mongodb.net/amapels?retryWrites=true&w=majority
```

## Testing Locally
To use the same database locally, update your `.env` file:
```env
MONGODB_URI=mongodb+srv://amapels-user:SecureP@ssw0rd@cluster0.abc123.mongodb.net/amapels?retryWrites=true&w=majority
```

## Troubleshooting

**Connection timeout?**
- Check Network Access allows 0.0.0.0/0
- Verify username/password are correct
- Ensure no special characters in password that need URL encoding

**Authentication failed?**
- Double-check username and password
- Make sure user has read/write permissions

**Database not found?**
- The database will be created automatically on first write
- Make sure database name is in the connection string

## Security Notes
- Never commit connection strings to Git (already in .gitignore)
- Use strong passwords for database users
- Consider IP whitelisting in production (current: allow all with auth)
