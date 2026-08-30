@echo off
set "PATH=%LOCALAPPDATA%\Programs\git\cmd;%LOCALAPPDATA%\Programs\node;%PATH%"
cd /d "C:\Users\pande\OneDrive\Desktop\project"

echo ======================================================
echo    KrishiVigyan AI - Push to GitHub
echo ======================================================
echo.
echo Pushing commits to https://github.com/5656ak/agri.git ...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [NOTICE] If prompted for credentials, please sign in or use a GitHub Personal Access Token.
)

echo.
pause
