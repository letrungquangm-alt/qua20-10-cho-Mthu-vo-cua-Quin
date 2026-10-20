Add-Type -AssemblyName System.Drawing
$assetsDir = Join-Path (Get-Location).Path "assets"
$srcPath = Join-Path $assetsDir "sprites\teddy_with_bone.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Pixel 550,580: $($bmp.GetPixel(550, 580))"
Write-Output "Pixel 560,560: $($bmp.GetPixel(560, 560))"
Write-Output "Pixel 600,550: $($bmp.GetPixel(600, 550))"
$bmp.Dispose()
