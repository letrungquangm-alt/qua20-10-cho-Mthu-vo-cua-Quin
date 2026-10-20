Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$assetsDir = Join-Path (Get-Location).Path "assets"

$f5 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404310.jpg")
# Wheel is at x: 885, y: 60, w: 90, h: 175
$wheelRaw = New-Object System.Drawing.Bitmap(90, 175, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($wheelRaw)
$g.DrawImage($f5, (New-Object System.Drawing.Rectangle(0, 0, 90, 175)), (New-Object System.Drawing.Rectangle(885, 60, 90, 175)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$f5.Dispose()

# The groove inside the brass bezel is from x: 30 to 82, y: 15 to 155
# In the groove, at x from 30 to 82, the horizontal gradient goes from dark bronze (x:32) to highlight (x:70) to shadow (x:80)
# Sample 1 clean horizontal line at y = 18 (above the number 1)
$cleanLine = New-Object System.Drawing.Color[] 90
for ($x = 0; $x -lt 90; $x++) {
    $cleanLine[$x] = $wheelRaw.GetPixel($x, 18)
}

# Paint this clean profile across all rows inside the groove (y: 20 to 152)
for ($y = 20; $y -le 152; $y++) {
    for ($x = 32; $x -le 82; $x++) {
        $c = $cleanLine[$x]
        $wheelRaw.SetPixel($x, $y, $c)
    }
}

# Now remove white background
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

$wheelClean = Remove-WhiteBg $wheelRaw 245 28
$wheelRaw.Dispose()

$destPath = Join-Path $assetsDir "ui\brass_wheel_blank.png"
$fs = [System.IO.File]::Create($destPath)
$wheelClean.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$wheelClean.Dispose()
Write-Output "Successfully inpainted brass_wheel_blank.png!"
