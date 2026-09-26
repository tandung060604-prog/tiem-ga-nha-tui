@echo off
chcp 65001 >nul
title [GEMINI 2] - CORE GAMEPLAY & ECONOMY (TÀI KHOẢN 2)
color 0B

:: Cách ly toàn bộ Profile cho Tài Khoản 2
set "PROFILE_DIR=C:\Users\HP\.gemini-profiles\gemini-2-core"
set "USERPROFILE=%PROFILE_DIR%"
set "HOMEDRIVE=C:"
set "HOMEPATH=\Users\HP\.gemini-profiles\gemini-2-core"
set "LOCALAPPDATA=%PROFILE_DIR%\AppData\Local"
set "APPDATA=%PROFILE_DIR%\AppData\Roaming"
set "PATH=C:\Users\HP\AppData\Local\agy\bin;%PATH%"

cd /d "d:\AI Vin Thực Chiến\Side Project\TiemGaRan"

echo =====================================================================
echo  [GEMINI 2] CORE GAMEPLAY ^& ECONOMY (TÀI KHOẢN GOOGLE 2)
echo  Thư mục Profile độc lập: %PROFILE_DIR%
echo  Nhiệm vụ: src/core/*.ts, tests/*.ts, kho FIFO, hoàn vốn -5
echo =====================================================================
echo.
echo * HƯỚNG DẪN ĐĂNG NHẬP TÀI KHOẢN 2:
echo   Khi trình duyệt mở ra, hãy chọn/đăng nhập TÀI KHOẢN GOOGLE 2 của bạn.
echo   (Nếu trình duyệt tự nhận tài khoản 1, bấm "Sử dụng tài khoản khác").
echo.

agy --dangerously-skip-permissions -i "BẠN LÀ GEMINI 2: CORE GAMEPLAY & ECONOMY SPECIALIST. Hãy đọc AGENTS.md, docs/WORKFLOW_3_GEMINI_CLAUDE_LEAD.md và docs/03-de-xuat-gameplay-va-story-endings.md. Ranh giới của bạn là src/core/*.ts, tests/*.ts, src/content/inventory.ts, src/ui/components/InventoryTab.ts. Nhiệm vụ trọng tâm: tính năng nút -5 hoàn tiền kho và phân tầng mở khóa nguyên liệu. Báo cáo: [GEMINI 2 READY - TỰ ĐỘNG THỰC THI (AUTO-PROCEED)]"
pause
