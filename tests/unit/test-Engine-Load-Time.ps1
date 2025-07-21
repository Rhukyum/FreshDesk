<#
.SYNOPSIS
    Mesure le temps de chargement du moteur.
.DESCRIPTION
    Vérifie que le chargement des métadonnées est rapide.
.AUTHOR
    Auto-généré
#>

$start = Get-Date
Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$null = Get-AllScriptsMetadata
$end = Get-Date
$duration = ($end - $start).TotalSeconds

if ($duration -lt 3) {
    Write-Host "✅ Chargement rapide : $duration sec"
    exit 0
}
Write-Host "❌ Chargement trop lent : $duration sec"
exit 1