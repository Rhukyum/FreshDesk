<#
.SYNOPSIS
    Action liée à rollback example.

.DESCRIPTION
    Ce script effectue une tâche de type 'system' : rollback example.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        ROLLBACK-EXAMPLE
@category    system
@tags        fixshell,system
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de rollback-example" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de rollback-example" -Status "OK"
