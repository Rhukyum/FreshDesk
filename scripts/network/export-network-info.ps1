<#
.SYNOPSIS
    Action liée à export network info.

.DESCRIPTION
    Ce script effectue une tâche de type 'network' : export network info.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        EXPORT-NETWORK-INFO
@category    network
@tags        fixshell,network
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de export-network-info" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de export-network-info" -Status "OK"
