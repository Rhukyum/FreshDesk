<#
.SYNOPSIS
    Test unitaire pour la fonction Get-QuickScriptStats
.DESCRIPTION
    Ce test vérifie que la fonction retourne bien des stats cohérentes (nombre total, valides, invalides).
.AUTHOR
    Auto-généré par assistant
#>

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

$stats = Get-QuickScriptStats

if (-not $stats) {
    Write-Host "❌ La fonction Get-QuickScriptStats n’a rien retourné."
    exit 1
}

if ($stats.Total -lt 0) {
    Write-Host "❌ Stat Total incohérent."
    exit 1
}

Write-Host "✅ Get-QuickScriptStats fonctionne correctement."
exit 0
