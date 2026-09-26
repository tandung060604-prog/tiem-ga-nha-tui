@echo off
chcp 65001 >nul
title [GEMINI 3] - NARRATIVE DIRECTOR & STORY (TÀI KHOẢN 3)
color 0D

:: Cách ly toàn bộ Profile cho Tài Khoản 3
set "PROFILE_DIR=C:\Users\HP\.gemini-profiles\gemini-3-narrative"
set "USERPROFILE=%PROFILE_DIR%"
set "HOMEDRIVE=C:"
set "HOMEPATH=\Users\HP\.gemini-profiles\gemini-3-narrative"
set "LOCALAPPDATA=%PROFILE_DIR%\AppData\Local"
set "APPDATA=%PROFILE_DIR%\AppData\Roaming"
set "PATH=C:\Users\HP\AppData\Local\agy\bin;%PATH%"

cd /d "d:\AI Vin Thực Chiến\Side Project\TiemGaRan"

echo =====================================================================
echo  [GEMINI 3] NARRATIVE DIRECTOR (TÀI KHOẢN GOOGLE 3)
echo  Thư mục Profile độc lập: %PROFILE_DIR%
echo  Nhiệm vụ: src/content/*.ts, cốt truyện phân nhánh, Karma, 4 Ending
echo =====================================================================
echo.
echo * HƯỚNG DẪN ĐĂNG NHẬP TÀI KHOẢN 3:
echo   Khi trình duyệt mở ra, hãy chọn/đăng nhập TÀI KHOẢN GOOGLE 3 của bạn.
echo   (Nếu trình duyệt tự nhận tài khoản khác, bấm "Sử dụng tài khoản khác").
echo.

agy --dangerously-skip-permissions -i "BẠN LÀ GEMINI 3: NARRATIVE DIRECTOR & LORE WRITER. Hãy đọc AGENTS.md, docs/WORKFLOW_3_GEMINI_CLAUDE_LEAD.md và docs/03-de-xuat-gameplay-va-story-endings.md. Ranh giới của bạn là src/content/*.ts, docs/02-story-bible-v2.md. Nhiệm vụ trọng tâm: cây hội thoại phân nhánh 12 nhân vật Hẻm 1102, chỉ số ngầm Karma và 4 Đại kết cục (Happy, Open, Bad 3A/3B, Secret). Báo cáo: [GEMINI 3 READY - TỰ ĐỘNG THỰC THI (AUTO-PROCEED)]"
pause
