#!/bin/bash

echo "🍎 macOS Scientific Blog Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Step 1: Cleaning previous installation..."
rm -rf node_modules package-lock.json
npm cache clean --force 2>/dev/null || true

print_status "Step 2: Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully!"
else
    print_warning "npm install failed. Trying with --force flag..."
    if npm install --force; then
        print_success "Dependencies installed with --force!"
    else
        print_error "npm install failed. Trying yarn..."
        if command -v yarn &> /dev/null; then
            yarn install
            print_success "Dependencies installed with yarn!"
        else
            print_error "Both npm and yarn failed. Please install yarn: npm install -g yarn"
            exit 1
        fi
    fi
fi

print_status "Step 3: Setting up database..."
if npm run db:generate; then
    print_success "Prisma client generated!"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

if npm run db:push; then
    print_success "Database schema pushed!"
else
    print_error "Failed to push database schema"
    exit 1
fi

if npm run db:setup; then
    print_success "Demo data created!"
else
    print_warning "Demo data setup failed, but you can continue"
fi

print_success "🎉 Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Test: http://localhost:3000/test"
echo ""
echo "🔐 Demo users:"
echo "• Admin: admin@example.com / password123"
echo "• Premium: premium@example.com / password123"
echo "• User: user@example.com / password123"
echo ""
print_success "Happy coding! 🎯"