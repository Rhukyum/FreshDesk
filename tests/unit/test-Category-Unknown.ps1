<#
.SYNOPSIS
    Vérifie le comportement avec une catégorie inconnue dans .METADATA.
.DESCRIPTION
    Ce test injecte un script avec une catégorie invalide et vérifie qu’il est rejeté.
.AUTHOR
    Auto-généré par assistant
#>

$scriptPath = "$PSScriptRoot/../../scripts/Test-Cat-Invalide.ps1"
$content = @'
<#
.SYNOPSIS
    Test cat invalide
.DESCRIPTION
    Test mauvais champ
.AUTHOR
    Test
.METADATA
@name     = "Cat Invalide"
@category = "Inconnue"
@code     = "Z999"
#>
Write-Host "Test"
'@
$content | Set-Content -Path $scriptPath
Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

$stats = Get-QuickScriptStats
if ($stats.Invalid -ge 1) {
    Write-Host "✅ Catégorie invalide détectée."
    Remove-Item $scriptPath -Force
    exit 0
}
Write-Host "❌ Script invalide non détecté."
Remove-Item $scriptPath -Force
exit 1