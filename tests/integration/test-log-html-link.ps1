<#
.SYNOPSIS
    Vérifie l'affichage du lien HTML dans le menu.
.DESCRIPTION
    Exécute le menu CLI et vérifie que le lien HTML est affiché à la fin.
.AUTHOR
    Auto-généré par assistant
#>

$output = & "$PSScriptRoot/../../cli/menu.ps1" -TestMode
if ($output -match "export-report.html") {
    Write-Host "✅ Lien HTML visible."
    exit 0
}
Write-Host "❌ Lien HTML manquant."
exit 1