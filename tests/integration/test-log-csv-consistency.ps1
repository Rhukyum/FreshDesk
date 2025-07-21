<#
.SYNOPSIS
    Vérifie que le log .log est bien structuré pour un export CSV.
.DESCRIPTION
    Exécute un script puis vérifie la structure du log.
.AUTHOR
    Auto-généré
#>

& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Exemple-OK"
$log = Get-ChildItem "$PSScriptRoot/../../logs" -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

$lines = Get-Content $log.FullName
$first = $lines[0] -split ","
if ($first.Count -ge 4) {
    Write-Host "✅ Log compatible CSV."
    exit 0
}
Write-Host "❌ Log CSV mal formé."
exit 1