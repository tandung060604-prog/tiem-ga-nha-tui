@echo off
chcp 65001 >nul
title [GEMINI 1] - UI & VISUAL SPECIALIST (TÀI KHOẢN 1)
color 0E

:: Cách ly toàn bộ Profile cho Tài Khoản 1
set "PROFILE_DIR=C:\Users\HP\.gemini-profiles\gemini-1-ui"
set "USERPROFILE=%PROFILE_DIR%"
set "HOMEDRIVE=C:"
set "HOMEPATH=\Users\HP\.gemini-profiles\gemini-1-ui"
set "LOCALAPPDATA=%PROFILE_DIR%\AppData\Local"
set "APPDATA=%PROFILE_DIR%\AppData\Roaming"
set "PATH=C:\Users\HP\AppData\Local\agy\bin;%PATH%"

cd /d "d:\AI Vin Thực Chiến\Side Project\TiemGaRan"

echo =====================================================================
echo  [GEMINI 1] UI ^& VISUAL SPECIALIST (TÀI KHOẢN GOOGLE 1)
echo  Thư mục Profile độc lập: %PROFILE_DIR%
echo  Nhiệm vụ: src/styles/*.css, assets-src/**, docs/gemini/**
echo =====================================================================
echo.
echo * HƯỚNG DẪN ĐĂNG NHẬP TÀI KHOẢN 1:
echo   Khi trình duyệt mở ra, hãy chọn/đăng nhập TÀI KHOẢN GOOGLE 1 của bạn.
echo.

agy --dangerously-skip-permissions -i "BẠN LÀ GEMINI 1: UI & VISUAL SPECIALIST. Hãy đọc AGENTS.md và docs/WORKFLOW_3_GEMINI_CLAUDE_LEAD.md để nắm rõ ranh giới: Bạn phụ trách src/styles/*.css, assets-src/**, docs/gemini/**. Hãy kiểm tra trạng thái giao diện và báo cáo: [GEMINI 1 READY - TỰ ĐỘNG THỰC THI (AUTO-PROCEED)]"
pause
