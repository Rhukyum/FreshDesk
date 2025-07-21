<#
.SYNOPSIS
    Menu CLI interactif pour FixShell.
.DESCRIPTION
    Permet d’exécuter les scripts via interface console.
.AUTHOR
    FixShell Team
#>

do {
    Clear-Host
    Write-Host "🛠️  FixShell — Menu Principal" -ForegroundColor Cyan
    Write-Host "1. Lister les scripts disponibles"
    Write-Host "2. Exécuter un script par son nom"
    Write-Host "T. Lancer tous les tests"
    Write-Host "Q. Quitter"
    $choice = Read-Host "Choix"

    switch ($choice.ToUpper()) {
        '1' {
            $list = & "$PSScriptRoot/../engine/engine.ps1"
            (Get-ChildItem "$PSScriptRoot/../scripts/" -Filter *.ps1).Name
            Pause
        }
        '2' {
            $script = Read-Host "Nom exact du script"
            & "$PSScriptRoot/../engine/engine.ps1" -RunScript $script
            Pause
        }
        'T' {
            Write-Host "`n🧪 Tests unitaires + intégration..." -ForegroundColor Cyan
            & "$PSScriptRoot/../tests/run-unit-tests.ps1"
            & "$PSScriptRoot/../tests/run-integration-tests.ps1"
            Pause
        }
    }
} until ($choice -eq 'Q')