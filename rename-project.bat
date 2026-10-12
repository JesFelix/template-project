@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

rem ============================================================
rem  Rename this project: replaces every project-name related
rem  string in the whole repository in one go.
rem  Usage: double-click, then follow the prompts.
rem
rem  Notes:
rem   - ASCII-only on purpose: non-ASCII text inside a .bat gets
rem     mangled by cmd under non-UTF-8 code pages.
rem   - All replacement values are passed to PowerShell through
rem     environment variables, so no quoting/escaping is needed.
rem ============================================================

rem Old names -- update these first when renaming again later
set "OLD_PKG=template-project"
set "OLD_LIB=template_project_lib"
set "OLD_TITLE=Template Project"
set "OLD_IDENT=com.jesfelix.template-project"

echo ============================================================
echo  Project rename tool
echo ============================================================
echo  Current project name: %OLD_PKG%
echo  Files to update:
echo    package.json / package-lock.json
echo    src-tauri\Cargo.toml / src-tauri\Cargo.lock
echo    src-tauri\tauri.conf.json / src-tauri\src\main.rs
echo    index.html / README.md / AGENTS.md
echo ============================================================
echo.

set /p "NEW_PKG=New package name (kebab-case, e.g. my-app): "
if not defined NEW_PKG (
    echo.
    echo [Cancelled] No name entered.
    exit /b 1
)

rem Derive the Rust lib name from the package name: my-app -> my_app_lib
set "NEW_LIB=!NEW_PKG:-=_!_lib"

echo.
set /p "NEW_TITLE=Window title / README title [default: %NEW_PKG%]: "
if not defined NEW_TITLE set "NEW_TITLE=%NEW_PKG%"

echo.
set /p "NEW_IDENT=App identifier [default: com.jesfelix.%NEW_PKG%]: "
if not defined NEW_IDENT set "NEW_IDENT=com.jesfelix.%NEW_PKG%"

echo.
echo ------------------------------------------------------------
echo  Replacing:
echo    package/product name : %OLD_PKG%  -^>  %NEW_PKG%
echo    rust lib name        : %OLD_LIB%  -^>  %NEW_LIB%
echo    window title         : %OLD_TITLE%  -^>  %NEW_TITLE%
echo    identifier           : %OLD_IDENT%  -^>  %NEW_IDENT%
echo ------------------------------------------------------------
echo.

rem tauri.conf.json: targeted replacements first. Otherwise the generic
rem package-name replace would already have rewritten identifier and
rem window title, leaving nothing for them to match.
call :rep "src-tauri\tauri.conf.json" "%OLD_IDENT%" "%NEW_IDENT%" identifier
call :rep "src-tauri\tauri.conf.json" "%OLD_PKG%" "%NEW_TITLE%" title
call :rep "src-tauri\tauri.conf.json" "%OLD_PKG%" "%NEW_PKG%"

call :rep "package.json" "%OLD_PKG%" "%NEW_PKG%"
call :rep "package-lock.json" "%OLD_PKG%" "%NEW_PKG%"
call :rep "src-tauri\Cargo.toml" "%OLD_PKG%" "%NEW_PKG%"
call :rep "src-tauri\Cargo.toml" "%OLD_LIB%" "%NEW_LIB%"
call :rep "src-tauri\Cargo.lock" "%OLD_PKG%" "%NEW_PKG%"
call :rep "src-tauri\src\main.rs" "%OLD_LIB%" "%NEW_LIB%"
call :rep "AGENTS.md" "%OLD_LIB%" "%NEW_LIB%"
call :rep "index.html" "<title>Tauri + Vue + Typescript App" "<title>%NEW_TITLE%"
call :rep "README.md" "# %OLD_TITLE%" "# %NEW_TITLE%"

echo ------------------------------------------------------------
echo  Done.
echo.
echo  Next steps:
echo    1. Run `npm run tauri dev` to verify the app still starts.
echo    2. Only file contents were changed. The root folder name
echo       is NOT renamed; rename it manually if you want
echo       (close editors/terminals holding it first).
echo    3. Double check nothing else refers to the old name:
echo        git grep -i %OLD_PKG%
echo ------------------------------------------------------------
pause
exit /b 0


rem ------------------------------------------------------------
rem  Subroutine: replace old with new inside the given file.
rem  Files stay UTF-8 without BOM. Values travel through
rem  environment variables, and quote characters are built inside
rem  PowerShell via [char]34, so the batch file never has to deal
rem  with escaped quotes (cmd's `call` mangles them).
rem
rem  Usage: :rep "path" "old" "new" ["jsonKey"]
rem    with jsonKey  -> matches  "jsonKey": "old"  and writes "jsonKey": "new"
rem    without it    -> plain text replace of old -> new
rem ------------------------------------------------------------
:rep
set "PS_FILE=%~1"
set "PS_OLD=%~2"
set "PS_NEW=%~3"
set "PS_KEY=%~4"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$q=[char]34; $f=$env:PS_FILE; $k=$env:PS_KEY;" ^
 "if(-not (Test-Path -LiteralPath $f)){ Write-Host ('  [skip] '+$f+' (missing)'); exit 0 };" ^
 "$p=(Resolve-Path -LiteralPath $f).Path;" ^
 "$t=[IO.File]::ReadAllText($p,[Text.Encoding]::UTF8);" ^
 "if($k){ $o=$q+$k+$q+': '+$q+$env:PS_OLD+$q; $n=$q+$k+$q+': '+$q+$env:PS_NEW+$q; }else{ $o=$env:PS_OLD; $n=$env:PS_NEW };" ^
 "if(-not $t.Contains($o)){ Write-Host ('  [same] '+$(if($k){$f+' ('+$k+')'}else{$f})); exit 0 };" ^
 "[IO.File]::WriteAllText($p,$t.Replace($o,$n),(New-Object Text.UTF8Encoding $false));" ^
 "Write-Host ('  [ok]   '+$(if($k){$f+' ('+$k+')'}else{$f}))"
set "PS_FILE="
set "PS_OLD="
set "PS_NEW="
set "PS_KEY="
exit /b 0
