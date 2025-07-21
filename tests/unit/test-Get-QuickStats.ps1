<#
.SYNOPSIS
    Test unitaire pour Get-QuickScriptStats
.DESCRIPTION
    Ce test complète les vérifications sur les stats rapides.
.AUTHOR
    Auto-généré par assistant
#>

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

$stats = Get-QuickScriptStats

if ($stats.Invalid -gt $stats.Total) {
    Write-Host "❌ Trop d'invalides par rapport au total !"
    exit 1
}

Write-Host "✅ Statistiques cohérentes (valide/invalide vs total)."
exit 0
