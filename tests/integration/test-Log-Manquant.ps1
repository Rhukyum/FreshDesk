<#
.SYNOPSIS
    Vérifie le comportement si le dossier logs/ est supprimé.
.DESCRIPTION
    Ce test supprime temporairement le dossier logs/ et exécute un script pour voir si le système recrée les logs.
.AUTHOR
    Auto-généré par assistant
#>

$logsPath = "$PSScriptRoot/../../logs"
if (Test-Path $logsPath) {
    Remove-Item $logsPath -Recurse -Force
}

& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Exemple-OK"

if (Test-Path $logsPath) {
    Write-Host "✅ Le dossier logs/ a été recréé automatiquement."
    exit 0
} else {
    Write-Host "❌ Le dossier logs/ n’a pas été recréé."
    exit 1
}