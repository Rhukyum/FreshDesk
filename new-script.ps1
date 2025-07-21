<#
.SYNOPSIS
    Générateur de script FixShell.
.DESCRIPTION
    Pose des questions et crée un script avec en-tête standardisé.
.AUTHOR
    FixShell Team
#>

$config = Get-Content "$PSScriptRoot/../config/settings.json" | ConvertFrom-Json
$cat = $config.categories

$name = Read-Host "Nom du script (ex: Nettoyer DNS)"
$category = Read-Host "Catégorie (ex: $($cat -join ', '))"
$code = Read-Host "Code logique (ex: N001)"

$template = @"
<#
.SYNOPSIS
    [résumé]
.DESCRIPTION
    [description détaillée]
.AUTHOR
    FixShell Team
#>
#.METADATA
# @name $name
# @category $category
# @code $code
# @REQUIRES
# @DEPENDENCIES
# @RESTART false

Write-Host "🚀 $name lancé avec succès"
"@

$template | Set-Content "$PSScriptRoot/../scripts/$name.ps1" -Encoding UTF8
Write-Host "✅ Script $name.ps1 créé."
