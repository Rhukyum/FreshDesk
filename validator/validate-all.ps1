<#
.SYNOPSIS
    Valide la structure des scripts FixShell.
.DESCRIPTION
    Vérifie que chaque script contient les champs obligatoires de .METADATA.
.AUTHOR
    FixShell Team
#>

$scripts = Get-ChildItem "$PSScriptRoot/../../scripts" -Filter *.ps1

$report = @()

foreach ($script in $scripts) {
    $lines = Get-Content $script.FullName
    $meta = $lines | Where-Object { $_ -match "# @name|@category|@code" }
    $missing = @()
    if ($meta -notmatch "@name") { $missing += "name" }
    if ($meta -notmatch "@category") { $missing += "category" }
    if ($meta -notmatch "@code") { $missing += "code" }

    if ($missing.Count -gt 0) {
        $report += "❌ $($script.Name) : manque $($missing -join ', ')"
    } else {
        $report += "✅ $($script.Name) : OK"
    }
}

$report | Set-Content "$PSScriptRoot/../../logs/validation-report.txt"
$report | ForEach-Object { Write-Host $_ }
