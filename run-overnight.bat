@echo off
chcp 65001 > nul
title TIỆM GÀ NHÀ TUI - TEST XUYÊN ĐÊM TREO MÁY CHECK BUG (v2.5.0)

echo =============================================================
echo 🌙 TIỆM GÀ NHÀ TUI - BỘ TEST XUYÊN ĐÊM TREO MÁY CHECK BUG
echo =============================================================
echo 1. Test Invariants toán học và Core Engine (10.000 ngày)
echo 2. Test Trình duyệt Chrome Chaos Monkey (Tự động chơi liên tục)
echo 3. Giám sát rò rỉ bộ nhớ RAM, DOM Node, UI Deadlock, Crash
echo =============================================================
echo.

set /p HOURS="Nhập số giờ bạn muốn treo máy (Mặc định: 8 tiếng): "
if "%HOURS%"=="" set HOURS=8

echo.
echo Bắt đầu chạy test trong %HOURS% giờ...
node scripts/run-overnight.mjs --hours=%HOURS% --mode=all

echo.
echo =============================================================
echo [Xong] Toàn bộ báo cáo và ảnh chụp lỗi lưu tại:
echo - docs/bao-cao-test-xuyen-dem.md
echo - logs/overnight-core-stress.log
echo - logs/overnight-browser-monkey.log
echo =============================================================
pause
