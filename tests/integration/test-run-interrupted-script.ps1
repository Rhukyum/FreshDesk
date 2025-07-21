<#
.SYNOPSIS
    Vérifie qu’un script interrompu est bien logué en erreur.
.DESCRIPTION
    Simule une interruption par 'exit' dans un script.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/Exit-Script.ps1"
$content = @'
<#
.SYNOPSIS
    Script interrompu
.DESCRIPTION
    Utilise exit pour simuler une coupure.
.AUTHOR
    Auto
.METADATA
@name     = "ExitScript"
@category = "Test"
@code     = "EXIT001"
#>
exit 1
'@
$content | Set-Content $path

& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "ExitScript"
Remove-Item $path -Force

$log = Get-Content "$PSScriptRoot/../../logs/*.log" | Select-String "EXIT001"
if ($log -match "Erreur" -or $log -match "échec") {
    Write-Host "✅ Interruption loguée."
    exit 0
}
Write-Host "❌ Interruption non loguée."
exit 1