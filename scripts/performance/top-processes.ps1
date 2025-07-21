<#
.SYNOPSIS
    Action liée à top processes.

.DESCRIPTION
    Ce script effectue une tâche de type 'performance' : top processes.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        TOP-PROCESSES
@category    performance
@tags        fixshell,performance
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de top-processes" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de top-processes" -Status "OK"
