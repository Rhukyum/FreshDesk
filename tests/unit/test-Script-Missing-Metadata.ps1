<#
.SYNOPSIS
    Vérifie un script avec .METADATA partielle.
.DESCRIPTION
    Simule un script avec @code mais sans @name ou @category.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/PartialMeta.ps1"
$content = @'
<#
.SYNOPSIS
    Test metadata partielle
.DESCRIPTION
    Champ manquant
.AUTHOR
    Auto
.METADATA
@code = "PART001"
#>
Write-Host "OK"
'@
$content | Set-Content $path

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$stats = Get-QuickScriptStats
Remove-Item $path -Force

if ($stats.Invalid -ge 1) {
    Write-Host "✅ .METADATA partielle détectée comme invalide."
    exit 0
}
Write-Host "❌ .METADATA partielle non détectée."
exit 1