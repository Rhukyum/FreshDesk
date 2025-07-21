<#
.SYNOPSIS
    Vérifie si un script sans .AUTHOR est signalé comme incomplet.
.DESCRIPTION
    Crée un faux script sans bloc .AUTHOR et vérifie la détection.
.AUTHOR
    Auto-généré
#>

$path = "$PSScriptRoot/../../scripts/Missing-Author.ps1"
$content = @'
<#
.SYNOPSIS
    Test missing author
.DESCRIPTION
    Simule un script sans auteur
.METADATA
@name     = "NoAuthor"
@category = "Test"
@code     = "MISSAUTH"
#>
Write-Host "OK"
'@
$content | Set-Content $path

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force
$data = Get-AllScriptsMetadata | Where-Object { $_.code -eq "MISSAUTH" }

if ($data -and -not ($data.author)) {
    Write-Host "✅ Auteur manquant bien détecté."
    Remove-Item $path -Force
    exit 0
}
Write-Host "❌ Auteur non détecté comme manquant."
Remove-Item $path -Force
exit 1