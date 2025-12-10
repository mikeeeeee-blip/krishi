# Database Connection Troubleshooting Guide

## 🔍 Issues Fixed

### 1. **Database Connection Not Awaited** ✅ FIXED
- **Problem**: `connectDB()` was async but not awaited, so server started before DB connection
- **Solution**: Created `initializeApp()` function that awaits database connection before starting server

### 2. **Missing MongoDB URI Validation** ✅ FIXED
- **Problem**: No validation if `MONGODB_URI` is set
- **Solution**: Added validation with clear error messages

### 3. **No Connection State Verification** ✅ FIXED
- **Problem**: Server could start even if database wasn't connected
- **Solution**: Added connection state check before starting server

---

## 🚀 How to Fix Your Database Connection

### Step 1: Check Your `.env` File

Make sure `backend/.env` exists and has:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/krishi_backend
```

### Step 2: Verify MongoDB URI Format

**MongoDB Atlas (Cloud):**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Local MongoDB:**
```
mongodb://localhost:27017/<database>
```

### Step 3: Test Connection

1. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Look for these messages:**
   ```
   🔄 Connecting to MongoDB...
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
      Database: krishi_backend
   ```

3. **If you see errors:**
   - ❌ `MONGODB_URI is not set` → Add it to `.env`
   - ❌ `MongoDB connection failed` → Check URI format and credentials
   - ❌ `Database is not connected` → Check MongoDB server status

---

## 🔧 Common Issues & Solutions

### Issue 1: "MONGODB_URI is not set"

**Solution:**
1. Create `backend/.env` file
2. Copy from `backend/example.env`
3. Set your MongoDB connection string

### Issue 2: "MongoDB connection failed"

**Possible Causes:**
- ❌ Wrong username/password
- ❌ Network connectivity issues
- ❌ MongoDB server not running (for local)
- ❌ IP not whitelisted (for MongoDB Atlas)

**Solutions:**

**For MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access"
3. Add your IP address (or `0.0.0.0/0` for all IPs - development only)
4. Verify username/password in Database Access

**For Local MongoDB:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl status mongod
# or
brew services list | grep mongodb
```

### Issue 3: "Data not saving to database"

**Check:**
1. ✅ Database connection is successful (see console logs)
2. ✅ No errors in API responses
3. ✅ Check MongoDB Compass or Atlas to verify data

**Debug Steps:**
1. Check server logs for errors
2. Verify API returns success response
3. Check database directly:
   ```bash
   # Using MongoDB Compass or mongo shell
   use krishi_backend
   db.users.find()
   db.products.find()
   ```

### Issue 4: "Connection timeout"

**Solutions:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Check firewall settings
- Try increasing timeout in `db.ts` (already set to 5s)

---

## 📊 Verify Data is Stored

### Method 1: MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your `MONGODB_URI`
3. Browse collections: `users`, `products`, etc.

### Method 2: MongoDB Atlas Dashboard
1. Go to your cluster
2. Click "Browse Collections"
3. Select your database
4. View collections

### Method 3: API Test
```bash
# Register a user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "firstName": "Test"
  }'

# Check if user exists
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛠️ Code Changes Made

### 1. `backend/src/config/db.ts`
- ✅ Added MongoDB URI validation
- ✅ Better error messages
- ✅ Connection event handlers
- ✅ Connection timeout settings

### 2. `backend/src/index.ts`
- ✅ Database connection now awaited before server starts
- ✅ Connection state verification
- ✅ Database name shown in startup message

### 3. `backend/src/controllers/auth.controller.ts`
- ✅ Added verification after user creation
- ✅ Better error handling

### 4. `backend/src/controllers/product.controller.ts`
- ✅ Added verification after product creation
- ✅ Better error handling

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] `backend/.env` file exists
- [ ] `MONGODB_URI` is set correctly
- [ ] MongoDB server is running (local) or accessible (Atlas)
- [ ] No firewall blocking connection
- [ ] IP whitelisted (for MongoDB Atlas)
- [ ] Username/password are correct
- [ ] Database name exists (or will be created automatically)

---

## 🐛 Still Having Issues?

1. **Check server logs** - Look for error messages
2. **Test MongoDB connection directly:**
   ```bash
   # Using mongosh (MongoDB Shell)
   mongosh "your_connection_string"
   ```
3. **Verify .env file is loaded:**
   - Make sure `.env` is in `backend/` directory
   - Restart server after changing `.env`
4. **Check network connectivity:**
   - Ping MongoDB server
   - Check VPN/firewall settings

---

## 📝 Example .env File

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (MongoDB)
# Replace with your actual connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krishi_backend?retryWrites=true&w=majority

# Security (JWT)
JWT_SECRET=your_jwt_secret_key_change_me_in_prod
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_change_me_in_prod
JWT_REFRESH_EXPIRES_IN=30d

# Security (Bcrypt)
BCRYPT_SALT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

**Last Updated**: 2024
**Version**: 1.0.0

