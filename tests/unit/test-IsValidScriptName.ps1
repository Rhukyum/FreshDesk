<#
.SYNOPSIS
    Test unitaire pour la fonction IsValidScriptName
.DESCRIPTION
    Ce test vérifie que la validation du nom de script fonctionne pour des cas simples.
.AUTHOR
    Auto-généré par assistant
#>

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

if (-not (IsValidScriptName -Name "Exemple-OK")) {
    Write-Host "❌ Nom de script valide non reconnu."
    exit 1
}

if (IsValidScriptName -Name "ScriptQuiExistePas") {
    Write-Host "❌ Faux positif : script inexistant reconnu comme valide."
    exit 1
}

Write-Host "✅ IsValidScriptName fonctionne correctement."
exit 0
