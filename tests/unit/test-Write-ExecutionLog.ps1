<#
.SYNOPSIS
    Test unitaire pour Write-ExecutionLog
.DESCRIPTION
    Ce test vérifie que la fonction peut écrire un log sans erreur.
.AUTHOR
    Auto-généré par assistant
#>

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

try {
    Write-ExecutionLog -ScriptName "TEST-LOG" -ScriptCode "X001" -Status "SUCCESS" -Duration "00:00:01"
    Write-Host "✅ Write-ExecutionLog fonctionne correctement."
    exit 0
} catch {
    Write-Host "❌ Erreur dans Write-ExecutionLog : $_"
    exit 1
}
