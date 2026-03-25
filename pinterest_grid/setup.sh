#!/bin/bash
# Installation and Setup Script
# Run this to get everything working

echo "📦 Pinterest Grid - Setup Script"
echo "================================"

# Check Node.js version
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+
  Download from: https://nodejs.org/
  "
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION detected"

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

echo "✓ Dependencies installed"

# Create necessary directories
echo ""
echo "📁 Creating project directories..."
mkdir -p src/{components,hooks,services,types,styles}
mkdir -p public
echo "✓ Directories created"

# Status
echo ""
echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next steps:"
echo ""
echo "1. Start development server:"
echo "   npm run dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Documentation:"
echo "   - DESIGN_DOC.md    → System design guide"
echo "   - COMPONENT_API.md → Component reference"
echo "   - INTERVIEW_GUIDE.md → Interview preparation"
echo "   - CHEATSHEET.md    → Quick reference"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
