# Convert the installed Windows font glyphs into SVG logo previews.
Add-Type -AssemblyName System.Drawing
$fontOutput = Join-Path $PSScriptRoot 'font-options'
$null = New-Item -ItemType Directory -Path $fontOutput -Force
$fontOptions = @(
    @{ Id='century-gothic'; Family='Century Gothic'; Style=[System.Drawing.FontStyle]::Bold },
    @{ Id='segoe-ui'; Family='Segoe UI'; Style=[System.Drawing.FontStyle]::Bold },
    @{ Id='arial-rounded'; Family='Arial Rounded MT Bold'; Style=[System.Drawing.FontStyle]::Regular },
    @{ Id='bahnschrift'; Family='Bahnschrift'; Style=[System.Drawing.FontStyle]::Bold },
    @{ Id='trebuchet'; Family='Trebuchet MS'; Style=[System.Drawing.FontStyle]::Bold },
    @{ Id='consolas'; Family='Consolas'; Style=[System.Drawing.FontStyle]::Bold }
)
$numberCulture = [System.Globalization.CultureInfo]::InvariantCulture
function Format-Coordinate([double]$Value) { $Value.ToString('0.###', $numberCulture) }
foreach ($fontOption in $fontOptions) {
    $fontFamily = [System.Drawing.FontFamily]::new($fontOption.Family)
    $glyphPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $glyphPath.AddString('TickList', $fontFamily, [int]$fontOption.Style, 64, [System.Drawing.PointF]::new(0,0), [System.Drawing.StringFormat]::GenericTypographic)
    $bounds = $glyphPath.GetBounds()
    $fontScale = 40 / $bounds.Height
    $logoWidth = [math]::Ceiling(88 + $bounds.Width * $fontScale + 4)
    $points = $glyphPath.PathPoints
    $types = $glyphPath.PathTypes
    $commands = [System.Text.StringBuilder]::new()
    function Point-Text([int]$Index) {
        (Format-Coordinate (88 + ($points[$Index].X - $bounds.X) * $fontScale)) + ' ' + (Format-Coordinate (12 + ($points[$Index].Y - $bounds.Y) * $fontScale))
    }
    for ($pointIndex = 0; $pointIndex -lt $points.Length; $pointIndex++) {
        $kind = $types[$pointIndex] -band 7
        if ($kind -eq 0) { $null = $commands.Append('M' + (Point-Text $pointIndex)) }
        elseif ($kind -eq 1) { $null = $commands.Append('L' + (Point-Text $pointIndex)) }
        elseif ($kind -eq 3) {
            $null = $commands.Append('C' + (Point-Text $pointIndex) + ' ' + (Point-Text ($pointIndex+1)) + ' ' + (Point-Text ($pointIndex+2)))
            $pointIndex += 2
        } else { throw "Unexpected glyph path type: $kind" }
        if (($types[$pointIndex] -band 128) -ne 0) { $null = $commands.Append('Z') }
    }
    foreach ($appearance in @('light','dark')) {
        $ink = if ($appearance -eq 'light') { '#1a1d26' } else { '#f2f4ff' }
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + $logoWidth + '" height="64" viewBox="0 0 ' + $logoWidth + ' 64" role="img" aria-labelledby="title"><title id="title">TickList — ' + $fontOption.Family + '</title><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4f6ef7"/><stop offset="1" stop-color="#8473f5"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#bg)"/><path d="m18 33 10 10 19-21" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="' + $commands.ToString() + '" fill="' + $ink + '" fill-rule="nonzero"/></svg>'
        Set-Content -LiteralPath (Join-Path $fontOutput ($fontOption.Id + '-' + $appearance + '.svg')) -Value $svg -Encoding utf8
    }
    $glyphPath.Dispose()
    $fontFamily.Dispose()
}
Write-Output 'Generated six font options with outlined light/dark SVG previews.'
