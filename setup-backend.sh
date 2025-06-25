#!/bin/bash

# Scientific Blog Backend Setup Script
echo "🔧 Setting up Scientific Blog Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_status "Node.js found: $(node --version)"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_status "npm found: $(npm --version)"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_info "Creating .env.local from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            
            # Generate a random secret for NextAuth
            if command -v openssl &> /dev/null; then
                SECRET=$(openssl rand -base64 32)
                echo "" >> .env.local
                echo "# Auto-generated secret" >> .env.local
                echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
                echo "EMAIL_TEST_SECRET=\"$(openssl rand -base64 16)\"" >> .env.local
            fi
            
            print_status "Created .env.local with basic configuration"
            print_warning "Please edit .env.local with your actual email credentials"
        else
            print_error ".env.example not found. Creating basic .env.local..."
            cat << EOF > .env.local
# Database
DATABASE_URL="file:./dev.db"

# Admin Email (REQUIRED - Change this!)
ADMIN_EMAIL="your-email@example.com"

# From Email
FROM_EMAIL="noreply@scientificblog.com"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'change-this-secret')"

# Email Test Secret
EMAIL_TEST_SECRET="$(openssl rand -base64 16 2>/dev/null || echo 'test-secret')"

# SMTP Configuration (Gmail example)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-16-char-app-password

# SendGrid Alternative
# SENDGRID_API_KEY=your_sendgrid_api_key

# Optional: Webhook notifications
# CONTACT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
EOF
        fi
    else
        print_status ".env.local already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    
    # Generate Prisma client
    print_info "Generating Prisma client..."
    npm run db:generate
    
    # Push database schema
    print_info "Pushing database schema..."
    npm run db:push
    
    # Setup initial data
    print_info "Setting up initial data..."
    npm run db:setup
    
    if [ $? -eq 0 ]; then
        print_status "Database setup completed"
    else
        print_error "Database setup failed"
        exit 1
    fi
}

# Test email configuration
test_email() {
    print_info "Testing email configuration..."
    
    # Start the server in background for testing
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test email endpoint
    RESPONSE=$(curl -s -X GET "http://localhost:3000/api/test-email?secret=${EMAIL_TEST_SECRET}" 2>/dev/null)
    
    # Kill the server
    kill $SERVER_PID 2>/dev/null
    
    if echo "$RESPONSE" | grep -q "success.*true"; then
        print_status "Email configuration test passed"
    else
        print_warning "Email test failed or email not configured"
        print_info "You can test email later by visiting: http://localhost:3000/api/test-email"
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Backend setup complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Edit .env.local with your actual email credentials"
    echo "2. Choose email provider (SendGrid recommended for production):"
    echo "   - SendGrid: Add SENDGRID_API_KEY"
    echo "   - SMTP: Add SMTP_HOST, SMTP_USER, SMTP_PASS"
    echo "3. Update ADMIN_EMAIL to your email address"
    echo ""
    echo "🧪 Testing Commands:"
    echo "   npm run dev                    # Start development server"
    echo "   npm run db:studio             # Open database browser"
    echo "   curl -X GET localhost:3000/api/test-email  # Test email"
    echo ""
    echo "📧 Email Setup Guide:"
    echo "   Gmail: Enable 2FA → Generate App Password → Use in SMTP_PASS"
    echo "   SendGrid: Create account → Get API key → Add to SENDGRID_API_KEY"
    echo ""
    echo "🔗 Useful URLs (when server is running):"
    echo "   http://localhost:3000                    # Frontend"
    echo "   http://localhost:3000/api/test-email     # Email test"
    echo "   http://localhost:3000/auth/signin        # Sign in"
    echo "   http://localhost:3000/contact            # Contact form"
    echo ""
    echo "🆘 Troubleshooting:"
    echo "   - Check .env.local file exists and has correct values"
    echo "   - Verify email credentials are correct"
    echo "   - Check console logs for errors"
    echo "   - See BACKEND_IMPLEMENTATION_GUIDE.md for detailed help"
}

# Main execution
main() {
    echo "🚀 Scientific Blog Backend Setup"
    echo "================================="
    
    check_dependencies
    setup_environment
    install_dependencies
    setup_database
    
    # Only test email if credentials are configured
    if grep -q "SMTP_USER\|SENDGRID_API_KEY" .env.local 2>/dev/null; then
        test_email
    else
        print_warning "Email not configured yet - skipping email test"
    fi
    
    show_next_steps
}

# Run main function
main
