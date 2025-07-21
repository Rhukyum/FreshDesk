<#
.SYNOPSIS
    Vérifie le menu en cas de saisie invalide.
.DESCRIPTION
    Simule une saisie invalide et attend une réponse d'erreur.
.AUTHOR
    Auto-généré par assistant
#>

$output = & "$PSScriptRoot/../../cli/menu.ps1" -TestInput "9999"
if ($output -match "Aucun script trouvé") {
    Write-Host "✅ Saisie invalide correctement gérée."
    exit 0
}
Write-Host "❌ Saisie invalide non détectée."
exit 1