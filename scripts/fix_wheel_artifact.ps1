Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$path = Join-Path $assetsDir "ui\brass_wheel_blank.png"
$bytes = [System.IO.File]::ReadAllBytes($path)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$orig = [System.Drawing.Bitmap]::FromStream($ms)
$bmp = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($orig, 0, 0)
$g.Dispose()
$orig.Dispose()
$ms.Dispose()

# Fill vertical dark artifact at x: 56-68, y: 15 to 150
for ($y = 15; $y -le 150; $y++) {
    for ($x = 56; $x -le 68; $x++) {
        $c = $bmp.GetPixel(48, $y)
        $bmp.SetPixel($x, $y, $c)
    }
}

$fs = [System.IO.File]::Create($path)
$bmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$bmp.Dispose()
Write-Output "Spotless brass_wheel_blank.png created!"
