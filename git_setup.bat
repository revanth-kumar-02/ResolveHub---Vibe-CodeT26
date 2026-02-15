@echo off
echo Configuring Git...
"C:\Program Files\Git\cmd\git.exe" config --global user.name "Revanth02"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "revanthp0201@gmail.com"

echo Initializing Git repository...
"C:\Program Files\Git\cmd\git.exe" init

echo Adding all files...
"C:\Program Files\Git\cmd\git.exe" add .

echo Committing files...
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit: IT Service & Help Desk Portal"

echo Adding remote origin...
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/revanth-kumar-02/ResolveHub---Vibe-CodeT26.git

echo Renaming branch to main...
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo Done!
pause
