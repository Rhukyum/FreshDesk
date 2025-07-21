$undoScripts = Get-ChildItem -Recurse -Path './scripts/undo' -Filter *.ps1
foreach ($script in $undoScripts) {
    Write-Host "Testing rollback script:" $script.Name
    try {
        & $script.FullName -ErrorAction Stop
        Write-Host " -> Success"
    } catch {
        Write-Warning " -> Failed: $_"
    }
}
