Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$reelW = 60
$cellH = 70
$reelH = $cellH * 10
$reelBmp = New-Object System.Drawing.Bitmap($reelW, $reelH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($reelBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$numFont = New-Object System.Drawing.Font("Georgia", 32, [System.Drawing.FontStyle]::Bold)
$engravedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 65, 38, 22))
$highlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(140, 255, 235, 190))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

for ($i = 0; $i -le 9; $i++) {
    $y = [float]($i * $cellH)
    $w = [float]$reelW
    $h = [float]$cellH
    $rectHigh = New-Object System.Drawing.RectangleF(0.0, [float]($y + 2.0), $w, $h)
    $rectEng = New-Object System.Drawing.RectangleF(0.0, $y, $w, $h)
    
    $g.DrawString("$i", $numFont, $highlightBrush, $rectHigh, $sf)
    $g.DrawString("$i", $numFont, $engravedBrush, $rectEng, $sf)
}

$g.Dispose()
$numFont.Dispose()
$engravedBrush.Dispose()
$highlightBrush.Dispose()

$destPath = Join-Path $assetsDir "ui\reel_0_to_9.png"
$fs = [System.IO.File]::Create($destPath)
$reelBmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$reelBmp.Dispose()
Write-Output "Successfully generated assets\ui\reel_0_to_9.png!"
