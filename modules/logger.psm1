function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO",
        [string]$LogFile = "$PSScriptRoot/../logs/execution-log.csv"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry = "$timestamp,$Level,$Message"
    Add-Content -Path $LogFile -Value $entry
}