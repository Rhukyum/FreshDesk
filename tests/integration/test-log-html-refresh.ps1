<#
.SYNOPSIS
    Vérifie que l’export HTML est mis à jour.
.DESCRIPTION
    Modifie le log puis relance l’export HTML pour vérifier son actualisation.
.AUTHOR
    Auto-généré
#>

$html = "$PSScriptRoot/../../logs/export-report.html"
Remove-Item $html -Force -ErrorAction SilentlyContinue
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Exemple-OK"
$htmlExists = Test-Path $html

if ($htmlExists) {
    Write-Host "✅ HTML recréé correctement."
    exit 0
}
Write-Host "❌ HTML manquant après exécution."
exit 1