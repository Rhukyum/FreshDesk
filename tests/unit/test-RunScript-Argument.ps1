<#
.SYNOPSIS
    Vérifie que -RunScript fonctionne avec nom avec espace.
.DESCRIPTION
    Teste si un script avec un nom contenant un espace peut être lancé via RunScript.
.AUTHOR
    Auto-généré par assistant
#>

$scriptPath = "$PSScriptRoot/../../scripts/Test Espace.ps1"
$content = @'
<#
.SYNOPSIS
    Test espace
.DESCRIPTION
    Test espace dans nom
.AUTHOR
    Auto
.METADATA
@name     = "Test Espace"
@category = "Test"
@code     = "TESPACE"
#>
Write-Host "✅ Executé"
'@
$content | Set-Content $scriptPath

$output = & "$PSScriptRoot/../../engine/engine.ps1" -RunScript "Test Espace"
Remove-Item $scriptPath -Force

if ($output -match "✅ Executé") {
    Write-Host "✅ Script avec espace exécuté."
    exit 0
}
Write-Host "❌ Échec exécution avec espace."
exit 1