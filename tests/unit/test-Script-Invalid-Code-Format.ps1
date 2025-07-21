<#
.SYNOPSIS
    Vérifie un format incorrect pour @code.
.DESCRIPTION
    Teste si un code avec caractères spéciaux est rejeté.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/BadCode.ps1"
$content = @'
<#
.SYNOPSIS
    Mauvais code
.DESCRIPTION
    Utilise un code avec des espaces
.AUTHOR
    Auto
.METADATA
@name     = "BadCode"
@category = "Test"
@code     = "BAD CODE"
#>
Write-Host "Erreur"
'@
$content | Set-Content $path
Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$stats = Get-QuickScriptStats

Remove-Item $path -Force
if ($stats.Invalid -ge 1) {
    Write-Host "✅ Format de code invalide détecté."
    exit 0
}
Write-Host "❌ Code invalide non détecté."
exit 1