function Show-Menu {
    $scripts = Get-ChildItem "$PSScriptRoot\..\scripts" -Recurse -Filter *.ps1
    $choices = @{}
    $i = 1
    foreach ($script in $scripts) {
        $choices[$i] = $script
        Write-Host "$i. $($script.BaseName)"
        $i++
    }
    Write-Host "[i] Info d’un script"
    Write-Host "[q] Quitter"
    return $choices
}

while ($true) {
    $choices = Show-Menu
    $choice = Read-Host "Choisissez un script ou une option"

    if ($choice -eq "q") { break }
    elseif ($choice -eq "i") {
        $n = Read-Host "Numéro du script pour afficher les métadonnées"
        if ($choices.ContainsKey([int]$n)) {
            $content = Get-Content $choices[$n].FullName -Raw
            $content -match "\.SYNOPSIS\s+(.*)" | Out-Null
            Write-Host "SYNOPSIS: $($Matches[1])"
        }
    }
    elseif ($choices.ContainsKey([int]$choice)) {
        & $choices[$choice].FullName
        Read-Host "Appuyez sur Entrée pour continuer"
    }
}
