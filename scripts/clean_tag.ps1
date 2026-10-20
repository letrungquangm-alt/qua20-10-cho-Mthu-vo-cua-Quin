Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$path = Join-Path $assetsDir "ui\bouquet_reveal.png"
$bytes = [System.IO.File]::ReadAllBytes($path)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$orig = [System.Drawing.Bitmap]::FromStream($ms)
$bmp = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0)
$g.Dispose()
$orig.Dispose()
$ms.Dispose()

# Mask the paper tag remnants at bottom right: x > 150, y > 245
for ($y = 240; $y -lt $bmp.Height; $y++) {
    for ($x = 155; $x -lt $bmp.Width; $x++) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }
}

$fs1 = [System.IO.File]::Create($path)
$bmp.Save($fs1, [System.Drawing.Imaging.ImageFormat]::Png)
$fs1.Close()

$path2 = Join-Path $assetsDir "sprites\bouquet_bloom.png"
$fs2 = [System.IO.File]::Create($path2)
$bmp.Save($fs2, [System.Drawing.Imaging.ImageFormat]::Png)
$fs2.Close()
$bmp.Dispose()
Write-Output "Clean bouquet tag removed!"
