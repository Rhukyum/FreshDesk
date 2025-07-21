if (-not (Get-Command Write-Log -ErrorAction SilentlyContinue)) {
    Import-Module "$PSScriptRoot/logger.psm1" -Force
}