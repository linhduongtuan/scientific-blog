# 🍎 macOS Setup Guide for Scientific Blog Platform

## 🚨 Quick Fix for macOS

The dependency issue you encountered is due to a Linux-specific package. Here's the corrected setup:

### **1. Clean Installation**
```bash
# Remove problematic files
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install with updated dependencies
npm install
```

### **2. Alternative: Use Yarn (Recommended for macOS)**
```bash
# Install yarn if you don't have it
npm install -g yarn

# Remove npm files
rm -rf node_modules package-lock.json

# Install with yarn
yarn install
```

### **3. Database Setup**
```bash
# Generate Prisma client
npm run db:generate
# or: yarn db:generate

# Setup database with demo data
npm run setup
# or: yarn setup
```

### **4. Start Development**
```bash
npm run dev
# or: yarn dev
```

## 🔧 **If You Still Have Issues:**

### **Option 1: Force Install (Skip Platform Check)**
```bash
npm install --force
```

### **Option 2: Use Node Version Manager**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use Node 18 (recommended)
nvm install 18
nvm use 18

# Try installation again
npm install
```

### **Option 3: Manual Dependency Fix**
```bash
# Remove the problematic dependency
npm uninstall @typescript/native-preview

# Install without optional dependencies
npm install --no-optional
```

## 🎯 **Expected Success Output:**
After successful installation, you should see:
```bash
✅ Dependencies installed
✅ Database setup complete
✅ Demo users created
🚀 Server running on http://localhost:3000
```

## 🧪 **Test Your Setup:**
1. Visit: http://localhost:3000
2. Test page: http://localhost:3000/test
3. Try signing in with: `admin@example.com` / `password123`

## 📋 **macOS-Specific Notes:**

### **Homebrew Dependencies (if needed):**
```bash
# Install build tools if you encounter compilation errors
brew install python-setuptools
brew install node-gyp
```

### **Xcode Command Line Tools:**
```bash
xcode-select --install
```

## 🚀 **Alternative: Docker Setup (Isolated Environment)**

If you continue having dependency issues, use Docker:

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run db:generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF

# Build and run
docker build -t scientific-blog .
docker run -p 3000:3000 scientific-blog
```

## 🔍 **Troubleshooting Common macOS Issues:**

### **Permission Errors:**
```bash
sudo chown -R $(whoami) ~/.npm
```

### **Node Version Issues:**
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### **Clear Everything and Start Fresh:**
```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## ✅ **Success Checklist:**

- [ ] No error messages during `npm install`
- [ ] Database setup completes successfully
- [ ] Development server starts on port 3000
- [ ] Test page loads without errors
- [ ] Can sign in with demo users

## 🆘 **Still Having Issues?**

Try this minimal test:
```bash
# Test if Node.js works
node -e "console.log('Node.js works!')"

# Test if npm works
npm --version

# Test if you can create a basic Next.js app
npx create-next-app@latest test-app
```

If the basic test fails, the issue is with your Node.js/npm setup, not the project.

## 🎉 **Once Working:**

Your platform will have:
- ✅ Authentication system with demo users
- ✅ Real-time search functionality  
- ✅ Rich text comment system
- ✅ Admin dashboard
- ✅ Social authentication ready
- ✅ Performance optimizations

Happy coding on macOS! 🚀