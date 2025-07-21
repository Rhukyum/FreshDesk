<#
.SYNOPSIS
    Action liée à list app crashes.

.DESCRIPTION
    Ce script effectue une tâche de type 'diagnostics' : list app crashes.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        LIST-APP-CRASHES
@category    diagnostics
@tags        fixshell,diagnostics
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de list-app-crashes" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de list-app-crashes" -Status "OK"
