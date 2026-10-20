Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$assetsDir = Join-Path (Get-Location).Path "assets"

$f4 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404087.jpg")
# Full bouquet: x: 20, y: 190, w: 310, h: 375
$bouquetRaw = New-Object System.Drawing.Bitmap(310, 375, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bouquetRaw)
$g.DrawImage($f4, (New-Object System.Drawing.Rectangle(0, 0, 310, 375)), (New-Object System.Drawing.Rectangle(20, 190, 310, 375)), [System.Drawing.GraphicsUnit]::Pixel)

# Inpaint/erase tag at bottom right (relative x: 175 to 300, relative y: 290 to 370)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillRectangle($brushWhite, 175, 290, 130, 85)
$brushWhite.Dispose()
$g.Dispose()
$f4.Dispose()

# Remove white background
function Remove-WhiteBg($srcBitmap, $whiteThreshold = 244, $softBand = 30) {
    $w = $srcBitmap.Width
    $h = $srcBitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $srcBitmap.GetPixel($x, $y)
            $minC = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
            if ($minC -ge $whiteThreshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minC -gt ($whiteThreshold - $softBand)) {
                $factor = (255 - $minC) / (255 - ($whiteThreshold - $softBand))
                $alpha = [int]([Math]::Max(0, [Math]::Min(255, $factor * 255)))
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $dest.SetPixel($x, $y, $c)
            }
        }
    }
    return $dest
}

function Auto-Crop($bitmap, $padding = 4) {
    $minX = $bitmap.Width; $maxX = 0
    $minY = $bitmap.Height; $maxY = 0
    $hasContent = $false
    for ($y = 0; $y -lt $bitmap.Height; $y++) {
        for ($x = 0; $x -lt $bitmap.Width; $x++) {
            $c = $bitmap.GetPixel($x, $y)
            if ($c.A -gt 15) {
                $hasContent = $true
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    if (!$hasContent) { return $bitmap }
    $x0 = [Math]::Max(0, $minX - $padding)
    $y0 = [Math]::Max(0, $minY - $padding)
    $w = [Math]::Min($bitmap.Width - $x0, ($maxX - $minX + 1) + ($padding * 2))
    $h = [Math]::Min($bitmap.Height - $y0, ($maxY - $minY + 1) + ($padding * 2))
    
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gD = [System.Drawing.Graphics]::FromImage($dest)
    $gD.DrawImage($bitmap, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), (New-Object System.Drawing.Rectangle($x0, $y0, $w, $h)), [System.Drawing.GraphicsUnit]::Pixel)
    $gD.Dispose()
    return $dest
}

$clean = Remove-WhiteBg $bouquetRaw 245 28
$bouquetRaw.Dispose()
$final = Auto-Crop $clean 6
$clean.Dispose()

$p1 = Join-Path $assetsDir "ui\bouquet_reveal.png"
$fs1 = [System.IO.File]::Create($p1)
$final.Save($fs1, [System.Drawing.Imaging.ImageFormat]::Png)
$fs1.Close()

$p2 = Join-Path $assetsDir "sprites\bouquet_bloom.png"
$fs2 = [System.IO.File]::Create($p2)
$final.Save($fs2, [System.Drawing.Imaging.ImageFormat]::Png)
$fs2.Close()
$final.Dispose()
Write-Output "Full bouquet saved successfully!"
