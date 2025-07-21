<#
.SYNOPSIS
    Vérifie le comportement du moteur face à un script sans .METADATA.
.DESCRIPTION
    Ce test crée un faux script sans .METADATA et vérifie qu'il est bien ignoré ou signalé invalide.
.AUTHOR
    Auto-généré par assistant
#>

$tempScript = "$PSScriptRoot/../../scripts/Test-Corrompu.ps1"
Set-Content -Path $tempScript -Value "# Script sans metadata"
Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

$stats = Get-QuickScriptStats
if ($stats.Invalid -eq 0) {
    Write-Host "❌ Script corrompu non détecté."
    Remove-Item $tempScript -Force
    exit 1
}

Write-Host "✅ Script corrompu bien détecté comme invalide."
Remove-Item $tempScript -Force
exit 0