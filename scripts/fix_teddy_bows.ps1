Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$assetsDir = Join-Path (Get-Location).Path "assets"

$f2 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404186.jpg")
$cellW = 256
$cellH = 192

function Fix-TeddySprite($col, $destName, $extra = $null) {
    $raw = New-Object System.Drawing.Bitmap($cellW, $cellH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($raw)
    $g.DrawImage($f2, (New-Object System.Drawing.Rectangle(0, 0, $cellW, $cellH)), (New-Object System.Drawing.Rectangle(($col * $cellW), 0, $cellW, $cellH)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Right ear bow is at x: 165 to 205, y: 15 to 48
    $bowW = 40
    $bowH = 35
    $bow = New-Object System.Drawing.Bitmap($bowW, $bowH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($by = 0; $by -lt $bowH; $by++) {
        for ($bx = 0; $bx -lt $bowW; $bx++) {
            $c = $raw.GetPixel(165 + $bx, 15 + $by)
            if ($c.R -gt 170 -and $c.G -lt 165 -and ($c.R - $c.G) -gt 25) {
                $bow.SetPixel($bx, $by, $c)
            } else {
                $bow.SetPixel($bx, $by, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }
    $bow.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)

    # Place seamlessly on left ear (x: 60, y: 20)
    for ($by = 0; $by -lt $bowH; $by++) {
        for ($bx = 0; $bx -lt $bowW; $bx++) {
            $bc = $bow.GetPixel($bx, $by)
            if ($bc.A -gt 20) {
                $raw.SetPixel(60 + $bx, 20 + $by, $bc)
            }
        }
    }
    $bow.Dispose()

    # White bg removal
    $clean = New-Object System.Drawing.Bitmap($cellW, $cellH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $cellH; $y++) {
        for ($x = 0; $x -lt $cellW; $x++) {
            $c = $raw.GetPixel($x, $y)
            $minC = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
            if ($minC -ge 245) {
                $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minC -gt 215) {
                $alpha = [int](((255 - $minC) / 40.0) * 255)
                $clean.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $clean.SetPixel($x, $y, $c)
            }
        }
    }
    $raw.Dispose()

    # Auto crop
    $minX = $cellW; $maxX = 0; $minY = $cellH; $maxY = 0
    for ($y = 0; $y -lt $cellH; $y++) {
        for ($x = 0; $x -lt $cellW; $x++) {
            if ($clean.GetPixel($x, $y).A -gt 15) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $p = 4
    $x0 = [Math]::Max(0, $minX - $p)
    $y0 = [Math]::Max(0, $minY - $p)
    $w = [Math]::Min($cellW - $x0, ($maxX - $minX + 1) + ($p * 2))
    $h = [Math]::Min($cellH - $y0, ($maxY - $minY + 1) + ($p * 2))

    $final = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($final)
    $g2.DrawImage($clean, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), (New-Object System.Drawing.Rectangle($x0, $y0, $w, $h)), [System.Drawing.GraphicsUnit]::Pixel)
    $g2.Dispose()
    $clean.Dispose()

    $fullDest = Join-Path $assetsDir $destName
    $fs = [System.IO.File]::Create($fullDest)
    $final.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
    $fs.Close()

    if ($extra) {
        $fullExtra = Join-Path $assetsDir $extra
        $fsE = [System.IO.File]::Create($fullExtra)
        $final.Save($fsE, [System.Drawing.Imaging.ImageFormat]::Png)
        $fsE.Close()
    }
    $final.Dispose()
    Write-Output "Perfected: $destName"
}

Fix-TeddySprite 2 "sprites\teddy_full.png" "sprites\teddy_with_bone.png"
Fix-TeddySprite 3 "sprites\teddy_empty.png" $null
$f2.Dispose()
