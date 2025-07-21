<#
.SYNOPSIS
    Test d'intégration : exécuter un script exemple via le moteur.
.DESCRIPTION
    Ce test simule une exécution complète d'un script valide et vérifie si un log est généré.
.AUTHOR
    Auto-généré par assistant
#>

$scriptName = "Exemple-OK"

# Suppression du log si déjà présent
$logPath = Join-Path "$PSScriptRoot/../../logs" "$scriptName.log"
if (Test-Path $logPath) {
    Remove-Item $logPath -Force
}

# Exécution via le moteur
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript $scriptName

# Vérifie si le log a été généré
if (Test-Path $logPath) {
    Write-Host "✅ Exécution du script et log détecté."
    exit 0
} else {
    Write-Host "❌ Le log n’a pas été généré."
    exit 1
}
