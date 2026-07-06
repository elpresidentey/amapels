# AMAPELS Deployment Script
# PowerShell version for better cross-platform support

Write-Host "🚀 AMAPELS Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Make sure you're in the project root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    Write-Host "📋 Running pre-deployment checks..." -ForegroundColor Yellow
    Write-Host ""

    # Install dependencies
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install dependencies"
    }

    # Run system validation
    Write-Host "🔍 Validating system configuration..." -ForegroundColor Cyan
    npm run validate-system
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Warning: System validation failed. Please check configuration." -ForegroundColor Yellow
        $continue = Read-Host "Continue anyway? (Y/N)"
        if ($continue.ToLower() -ne "y") {
            Write-Host "Deployment cancelled." -ForegroundColor Yellow
            exit 1
        }
    }

    # Build the application
    Write-Host "🏗️  Building application for production..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }

    # Initialize git if needed
    if (-not (Test-Path ".git")) {
        Write-Host "🔧 Initializing git repository..." -ForegroundColor Cyan
        git init
        git add .
        git commit -m "Initial commit: AMAPELS e-commerce platform"
    }

    Write-Host ""
    Write-Host "✅ Pre-deployment checks completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Next steps for Vercel deployment:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Push your code to GitHub:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/yourusername/amapels.git" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Go to vercel.com and import your GitHub repository" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Configure environment variables in Vercel:" -ForegroundColor White
    Write-Host "   - MONGODB_URI (production MongoDB connection)" -ForegroundColor Gray
    Write-Host "   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (live key)" -ForegroundColor Gray
    Write-Host "   - PAYSTACK_SECRET_KEY (live key)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Deploy and test!" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"