<#
.SYNOPSIS
    Test unitaire pour Get-AllScriptsMetadata
.DESCRIPTION
    Ce test vérifie que tous les scripts retournent un tableau de métadonnées complet.
.AUTHOR
    Auto-généré par assistant
#>

Import-Module "$PSScriptRoot/../../engine/engine.ps1" -Force

$metadata = Get-AllScriptsMetadata
if (-not $metadata -or $metadata.Count -eq 0) {
    Write-Host "❌ Aucun script trouvé ou métadonnées absentes."
    exit 1
}

foreach ($m in $metadata) {
    if (-not $m.name -or -not $m.code -or -not $m.category) {
        Write-Host "❌ Métadonnées incomplètes détectées."
        exit 1
    }
}

Write-Host "✅ Get-AllScriptsMetadata retourne des données valides."
exit 0
