#!/bin/bash
# One-click fix script for Ko Lake Villa
# This seeds the database via the admin UI

echo "🔧 Ko Lake Villa - Fixing Site..."
echo ""
echo "This will:"
echo "  1. Open admin panel"
echo "  2. Click seed database button"
echo "  3. Verify site works"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Dev server not running!"
    echo "Please run: npm run dev"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Dev server is running"
echo ""
echo "📝 Please follow these steps:"
echo ""
echo "1. Open in browser: http://localhost:8080/admin"
echo "2. Click 'Setup' tab"
echo "3. Click 'Seed Database with Placeholder Content' button"
echo "4. Wait for green success message"
echo ""
echo "Would you like me to open the admin panel now? (y/n)"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo "🌐 Opening admin panel..."
    open "http://localhost:8080/admin"
    echo ""
    echo "👆 Click the Setup tab, then click 'Seed Database' button"
    echo ""
    echo "After clicking, press ENTER here to verify..."
    read -r
    
    # Run tests to verify
    echo "🧪 Running tests to verify fix..."
    npm test
else
    echo ""
    echo "No problem! Manually visit: http://localhost:8080/admin"
    echo "And follow the steps above."
fi

echo ""
echo "🎉 Done! Your site should now be working."
echo "Visit: http://localhost:8080"
