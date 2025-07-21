<#
.SYNOPSIS
    Action liée à list admin users.

.DESCRIPTION
    Ce script effectue une tâche de type 'security' : list admin users.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        LIST-ADMIN-USERS
@category    security
@tags        fixshell,security
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de list-admin-users" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de list-admin-users" -Status "OK"
