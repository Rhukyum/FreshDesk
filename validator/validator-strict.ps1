param (
    [string]$ScriptsPath = ".\scripts"
)

$missing = @()
Get-ChildItem -Path $ScriptsPath -Recurse -Filter *.ps1 | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $requiredTags = '.SYNOPSIS', '.DESCRIPTION', '.AUTHOR', '.REQUIRES', '.DEPENDENCIES', '.RESTART'
    $missingTags = $requiredTags | Where-Object { $content -notmatch $_ }
    if ($missingTags.Count -gt 0) {
        $missing += [PSCustomObject]@{
            Script = $_.FullName
            Missing = $missingTags -join ", "
        }
    }
}
$missing | Format-Table -AutoSize
