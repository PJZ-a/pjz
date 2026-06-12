@echo off
REM Build package from any current directory by switching to script location
pushd %~dp0
py -3 tools\package_site.py
if errorlevel 1 (
  python tools\package_site.py
)
popd
echo Done.
