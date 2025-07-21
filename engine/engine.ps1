param (
    [string]$RunScript = ""
)

Import-Module "$PSScriptRoot\..\modules\logger.psm1" -ErrorAction SilentlyContinue

function Load-Scripts {
    $scripts = Get-ChildItem "$PSScriptRoot\..\scripts" -Recurse -Filter *.ps1
    return $scripts
}

function Run-ScriptByName($name) {
    $scripts = Load-Scripts
    $target = $scripts | Where-Object { $_.BaseName -ieq $name }

    if (-not $target) {
        Write-Error "Script '$name' not found."
        return
    }

    $content = Get-Content $target.FullName -Raw
    $requiredTags = '.SYNOPSIS', '.DESCRIPTION', '.AUTHOR'
    $missing = $requiredTags | Where-Object { $content -notmatch $_ }
    if ($missing.Count -gt 0) {
        Write-Warning "Script '$name' is missing tags: $($missing -join ', ')"
    }

    try {
        & $target.FullName
        Write-Log -Message "Ran $name successfully" -Success $true
    } catch {
        Write-Log -Message "Failed to run $name: $_" -Success $false
    }
}

if ($RunScript) {
    Run-ScriptByName -name $RunScript
}
