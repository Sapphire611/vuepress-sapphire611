@echo off
setlocal

:: 检查是否提供了文件名
if "%~1"=="" (
    echo Usage: %0 filename
    exit /b 1
)

set "FILE=%~1"

:: 检查文件是否存在
if not exist "%FILE%" (
    echo File not found: %FILE%
    exit /b 1
)

:: 计算并打印 MD5、SHA-1、SHA-256 和 SHA-512 哈希值
echo MD5:    %FILE% | CertUtil -hashfile "%FILE%" MD5 | findstr /v /r /c:"$"
echo SHA-1:  %FILE% | CertUtil -hashfile "%FILE%" SHA1 | findstr /v /r /c:"$"
echo SHA-256: %FILE% | CertUtil -hashfile "%FILE%" SHA256 | findstr /v /r /c:"$"
echo SHA-512: %FILE% | CertUtil -hashfile "%FILE%" SHA512 | findstr /v /r /c:"$"

endlocal