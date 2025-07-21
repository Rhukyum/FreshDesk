<#
.SYNOPSIS
    Vérifie qu’un script vide est ignoré.
.DESCRIPTION
    Crée un fichier vide et teste sa détection comme invalide.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/Empty-Test.ps1"
New-Item -Path $path -ItemType File -Force | Out-Null

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$stats = Get-QuickScriptStats

if ($stats.Invalid -ge 1) {
    Write-Host "✅ Script vide détecté comme invalide."
    Remove-Item $path -Force
    exit 0
}
Write-Host "❌ Script vide non détecté."
Remove-Item $path -Force
exit 1