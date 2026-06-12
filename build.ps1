Push-Location -Path $PSScriptRoot
try {
    py -3 tools\package_site.py
} catch {
    python tools\package_site.py
}
Pop-Location
Write-Output 'Done.'
