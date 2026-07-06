@echo off
echo 🚀 AMAPELS Deployment Script
echo ================================

echo.
echo 📋 Running pre-deployment checks...
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

:: Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to install dependencies
    pause
    exit /b 1
)

:: Run system validation
echo 🔍 Validating system configuration...
call npm run validate-system
if %errorlevel% neq 0 (
    echo ⚠️  Warning: System validation failed. Please check configuration.
    echo Continue anyway? (Y/N)
    set /p continue=
    if /i "%continue%" neq "Y" (
        echo Deployment cancelled.
        pause
        exit /b 1
    )
)

:: Build the application
echo 🏗️  Building application for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error: Build failed
    pause
    exit /b 1
)

:: Initialize git if needed
if not exist ".git" (
    echo 🔧 Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit: AMAPELS e-commerce platform"
)

echo.
echo ✅ Pre-deployment checks completed successfully!
echo.
echo 🌐 Next steps for Vercel deployment:
echo.
echo 1. Push your code to GitHub:
echo    git remote add origin https://github.com/yourusername/amapels.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 2. Go to vercel.com and import your GitHub repository
echo.
echo 3. Configure environment variables in Vercel:
echo    - MONGODB_URI (production MongoDB connection)
echo    - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (live key)
echo    - PAYSTACK_SECRET_KEY (live key)
echo.
echo 4. Deploy and test!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.

pause