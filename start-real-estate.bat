@echo off
cd /d "D:\Real_estate"
start "Frontend" cmd /k "cd /d D:\Real_estate\frontend && npm run dev -- --host 0.0.0.0"
start "Backend" cmd /k "cd /d D:\Real_estate\backend && npm run dev"
start "http://127.0.0.1:5173" http://127.0.0.1:5173
exit
