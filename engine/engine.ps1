# 📊 Exécution des tests globaux si demandé
if ($TestAll) {
    & "$PSScriptRoot/../tests/generate-test-report.ps1"
    $reportPath = "$PSScriptRoot/../logs/tests-report.html"
    if (Test-Path $reportPath) {
        Write-Host "🧾 Rapport généré : $reportPath" -ForegroundColor Green
        if ($OpenReport) {
            Start-Process $reportPath
        }
    } else {
        Write-Host "❌ Rapport non généré." -ForegroundColor Red
    }
    exit
}
}


<#
.SYNOPSIS
    Moteur principal de FixShell : détection, validation, exécution.
.DESCRIPTION
    Charge tous les scripts de /scripts, lit leur .METADATA,
    permet de les exécuter, logue les actions, affiche un résumé.
.AUTHOR
    FixShell Team
#>

function Get-ScriptMetadata {
    param ([string]$Path)
    $block = Select-String -Path $Path -Pattern "^#\.METADATA" -Context 0, 20 | Select-Object -First 1
    if (-not $block) { return $null }

    $lines = Get-Content $Path | Select-Object -Skip $block.LineNumber
    $metadata = @{ }
    foreach ($line in $lines) {
        if ($line -match '^# @(\w+)\s+(.+)$') {
            $metadata[$matches[1]] = $matches[2]
        } elseif ($line -notmatch '^#') {
            break
        }
    }
    return [PSCustomObject]$metadata
}

function Get-AllScriptsMetadata {
    $list = @()
    Get-ChildItem "$PSScriptRoot/../scripts/" -Filter *.ps1 | ForEach-Object {
        $meta = Get-ScriptMetadata -Path $_.FullName
        if ($meta) {
            $meta | Add-Member -NotePropertyName path -NotePropertyValue $_.FullName
            $list += $meta
        }
    }
    return $list
}

function IsValidScriptName {
    param(
    [switch]$TestAll,
    [switch]$OpenReport,[string]$Name)
    return (Get-AllScriptsMetadata).name -contains $Name
}

function Get-QuickScriptStats {
    $scripts = Get-AllScriptsMetadata
    $total = $scripts.Count
    $valid = ($scripts | Where-Object { $_.name -and $_.category -and $_.code }).Count
    return @{ Total = $total; Valid = $valid; Invalid = $total - $valid }
}

function Write-ExecutionLog {
    param (
        [string]$ScriptName,
        [string]$ScriptCode,
        [string]$Status,
        [string]$Duration
    )
    $line = "{0} | {1} | {2} | {3}" -f (Get-Date -Format "s"), $ScriptCode, $Status, $Duration
    $out = Join-Path "$PSScriptRoot/../logs" "$ScriptName.log"
    Add-Content -Path $out -Value $line
}

param (
    [string]$RunScript
)

if ($RunScript) {
    $target = (Get-AllScriptsMetadata | Where-Object { $_.name -eq $RunScript })
    if ($target) {
        Write-Host "▶ Exécution : $($target.name)" -ForegroundColor Cyan
        $start = Get-Date
        try {
            & $target.path
            $duration = (Get-Date) - $start
            Write-ExecutionLog -ScriptName $target.name -ScriptCode $target.code -Status "SUCCESS" -Duration $duration
        } catch {
            $duration = (Get-Date) - $start
            Write-ExecutionLog -ScriptName $target.name -ScriptCode $target.code -Status "ERROR" -Duration $duration
            Write-Host "❌ Échec de l'exécution."
        }
    } else {
        Write-Host "❌ Script introuvable."
    }
}