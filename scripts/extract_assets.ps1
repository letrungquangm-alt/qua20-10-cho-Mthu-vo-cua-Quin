Add-Type -AssemblyName System.Drawing

$brainDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2"
$assetsDir = "g:\ẻm\assets"

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $src.Dispose()
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Saved: $destPath"
}

# 1. Inspect image dimensions
$safeImg = [System.Drawing.Image]::FromFile("$brainDir\lock_safe_1792411720078.jpg")
Write-Output "Safe: $($safeImg.Width) x $($safeImg.Height)"
$safeImg.Dispose()

$chestImg = [System.Drawing.Image]::FromFile("$brainDir\lock_chest_1792411746876.jpg")
Write-Output "Chest: $($chestImg.Width) x $($chestImg.Height)"
$chestImg.Dispose()

$woodenImg = [System.Drawing.Image]::FromFile("$brainDir\lock_wooden_1792411665930.jpg")
Write-Output "Wooden: $($woodenImg.Width) x $($woodenImg.Height)"
$woodenImg.Dispose()

$jewelryImg = [System.Drawing.Image]::FromFile("$brainDir\lock_jewelry_1792411690870.jpg")
Write-Output "Jewelry: $($jewelryImg.Width) x $($jewelryImg.Height)"
$jewelryImg.Dispose()

$itemsImg = [System.Drawing.Image]::FromFile("$brainDir\items_sheet_1792411800605.jpg")
Write-Output "Items: $($itemsImg.Width) x $($itemsImg.Height)"
$itemsImg.Dispose()
