Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$path = Join-Path $assetsDir "objects\painting_stars.png"
$bytes = [System.IO.File]::ReadAllBytes($path)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$orig = [System.Drawing.Bitmap]::FromStream($ms)
$w = $orig.Width
$h = $orig.Height

# Clear the feet at the very top (y: 0 to 18)
for ($y = 0; $y -le 16; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $orig.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }
}

# Blend the center inpaint area (around x: 75, y: 110)
# Sample surrounding deep navy blue watercolor
for ($y = 96; $y -le 122; $y++) {
    for ($x = 64; $x -le 86; $x++) {
        $dx = ($x - 75) / 10.0
        $dy = ($y - 109) / 12.0
        if (($dx*$dx + $dy*$dy) -le 1.0) {
            # Deep blue watercolor color
            $orig.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 34, 66, 120))
        }
    }
}

$fs1 = [System.IO.File]::Create($path)
$orig.Save($fs1, [System.Drawing.Imaging.ImageFormat]::Png)
$fs1.Close()

$path2 = Join-Path $assetsDir "objects\starry_painting.png"
$fs2 = [System.IO.File]::Create($path2)
$orig.Save($fs2, [System.Drawing.Imaging.ImageFormat]::Png)
$fs2.Close()

$orig.Dispose()
$ms.Dispose()
Write-Output "Clean 4-star painting saved!"
