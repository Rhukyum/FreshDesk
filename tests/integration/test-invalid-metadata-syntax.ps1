<#
.SYNOPSIS
    Vérifie qu’une syntaxe .METADATA cassée est rejetée.
.DESCRIPTION
    Injecte une syntaxe invalide dans .METADATA
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/BadMeta.ps1"
$content = @'
<#
.SYNOPSIS
    Test mauvaise metadata
.DESCRIPTION
    Mauvaise syntaxe
.AUTHOR
    Auto
.METADATA
name = Oups
category = Test
code = ZZZ
#>
Write-Host "Erreur"
'@
$content | Set-Content $path

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$stats = Get-QuickScriptStats

Remove-Item $path -Force

if ($stats.Invalid -ge 1) {
    Write-Host "✅ Mauvaise syntaxe détectée."
    exit 0
}
Write-Host "❌ Erreur de syntaxe non détectée."
exit 1