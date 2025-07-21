<#
.SYNOPSIS
    Vérifie les scripts avec un code en double.
.DESCRIPTION
    Teste deux scripts ayant le même @code pour voir s’ils sont détectés comme duplicata.
.AUTHOR
    Auto-généré par assistant
#>

$p1 = "$PSScriptRoot/../../scripts/Dup1.ps1"
$p2 = "$PSScriptRoot/../../scripts/Dup2.ps1"
$shared = @'
<#
.SYNOPSIS
    Dup
.DESCRIPTION
    Test duplication
.AUTHOR
    Auto
.METADATA
@name     = "Dup"
@category = "Test"
@code     = "DUP001"
#>
Write-Host "Dup"
'@
$shared | Set-Content $p1
$shared | Set-Content $p2

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$all = Get-AllScriptsMetadata
$codes = $all.code
$dupes = $codes | Group-Object | Where-Object { $_.Count -gt 1 }

if ($dupes) {
    Write-Host "✅ Code en double détecté."
    Remove-Item $p1, $p2 -Force
    exit 0
}
Write-Host "❌ Code en double non détecté."
Remove-Item $p1, $p2 -Force
exit 1