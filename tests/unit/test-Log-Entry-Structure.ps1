<#
.SYNOPSIS
    Vérifie la structure d’une entrée de log.
.DESCRIPTION
    S’assure que les logs contiennent les champs requis.
.AUTHOR
    Auto-généré
#>

$log = "$PSScriptRoot/../../logs/test-structure.log"
Write-ExecutionLog -ScriptName "Test" -Status "OK" -Message "Structure testée" -LogFile $log

$content = Get-Content $log
Remove-Item $log -Force

if ($content -match ",OK," -and $content -match "Test") {
    Write-Host "✅ Log contient les champs nécessaires."
    exit 0
}
Write-Host "❌ Log mal formé."
exit 1