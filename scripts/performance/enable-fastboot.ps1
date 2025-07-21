<#
.SYNOPSIS
    Action liée à enable fastboot.

.DESCRIPTION
    Ce script effectue une tâche de type 'performance' : enable fastboot.

.AUTHOR
    FreshDesk

.REQUIRES
    -Version 5.1

.DEPENDENCIES
    # Ajouter ici les dépendances spécifiques si besoin

.METADATA
@code        ENABLE-FASTBOOT
@category    performance
@tags        fixshell,performance
@version     auto
#>

# Chargement du logger
if (-not (Get-Module -ListAvailable -Name logger)) {
    . "$PSScriptRoot\..\..\modules\autoload.psm1"
}

Write-Log -Message "Exécution de enable-fastboot" -Status "START"

# TODO: Implémenter la logique ici

Write-Log -Message "Fin de enable-fastboot" -Status "OK"
