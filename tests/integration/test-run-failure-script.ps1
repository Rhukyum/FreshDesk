<#
.SYNOPSIS
    Vérifie qu’un script échoué est bien logué en erreur.
.DESCRIPTION
    Crée un faux script qui échoue à l’exécution.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/Fail-Script.ps1"
$content = @'
<#
.SYNOPSIS
    Script qui échoue
.DESCRIPTION
    Script volontairement en erreur
.AUTHOR
    Auto
.METADATA
@name     = "ErreurVolontaire"
@category = "Test"
@code     = "FAIL001"
#>
throw "Erreur simulée"
'@
$content | Set-Content $path
& "$PSScriptRoot/../../engine/engine.ps1" -RunScript "ErreurVolontaire"

$logs = Get-Content "$PSScriptRoot/../../logs/*.log" | Select-String "FAIL001"

Remove-Item $path -Force
if ($logs -match "Erreur") {
    Write-Host "✅ Échec logué correctement."
    exit 0
}
Write-Host "❌ Échec non logué."
exit 1