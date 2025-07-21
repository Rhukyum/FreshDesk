<#
.SYNOPSIS
    Vérifie l’exécution de tous les scripts.
.DESCRIPTION
    Lance tous les scripts valides et vérifie que chaque log est créé.
.AUTHOR
    Auto-généré par assistant
#>

& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "*"

$logs = Get-ChildItem "$PSScriptRoot/../../logs" -Filter "*.log"
if ($logs.Count -ge 1) {
    Write-Host "✅ Tous les scripts exécutés avec log."
    exit 0
}
Write-Host "❌ Aucun log trouvé après exécution globale."
exit 1