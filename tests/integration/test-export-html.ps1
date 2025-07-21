<#
.SYNOPSIS
    Vérifie la génération de l’export HTML après exécution d’un script.
.DESCRIPTION
    Ce test lance un script puis vérifie si le fichier logs/export-report.html est bien généré.
.AUTHOR
    Auto-généré par assistant
#>

$scriptName = "Exemple-OK"
$exportPath = Join-Path "$PSScriptRoot/../../logs" "export-report.html"

# Supprimer l’export s’il existe déjà
if (Test-Path $exportPath) {
    Remove-Item $exportPath -Force
}

# Exécuter le script
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript $scriptName

# Vérifier si l’export HTML est généré
if (Test-Path $exportPath) {
    Write-Host "✅ Export HTML généré avec succès."
    exit 0
} else {
    Write-Host "❌ Export HTML non trouvé."
    exit 1
}
