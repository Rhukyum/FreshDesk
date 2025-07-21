<#
.SYNOPSIS
    Vérifie les logs de plusieurs exécutions d’un même script.
.DESCRIPTION
    Lance deux fois un script et vérifie qu’il y a deux logs.
.AUTHOR
    Auto-généré
#>

$logBefore = (Get-ChildItem "$PSScriptRoot/../../logs/*.log").Count
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Exemple-OK"
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Exemple-OK"
$logAfter = (Get-ChildItem "$PSScriptRoot/../../logs/*.log").Count

if ($logAfter -ge $logBefore + 2) {
    Write-Host "✅ Deux exécutions = deux logs."
    exit 0
}
Write-Host "❌ Manque un log."
exit 1