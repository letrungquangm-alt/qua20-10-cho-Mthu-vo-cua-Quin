Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$assetsDir = Join-Path (Get-Location).Path "assets"

function Save-Png($bitmap, $relativePath) {
    $fullPath = Join-Path (Get-Location).Path $relativePath
    $dir = [System.IO.Path]::GetDirectoryName($fullPath)
    if (!(Test-Path $dir)) { [System.IO.Directory]::CreateDirectory($dir) | Out-Null }
    
    $fs = [System.IO.File]::Create($fullPath)
    $bitmap.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
    $fs.Close()
    Write-Output "Saved: $relativePath ($($bitmap.Width)x$($bitmap.Height))"
}

function Crop-Rect($srcBitmap, $x, $y, $w, $h) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcBitmap, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    return $cropped
}

function Remove-DarkBg($srcBitmap, $threshold = 30) {
    $w = $srcBitmap.Width
    $h = $srcBitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $srcBitmap.GetPixel($x, $y)
            $bright = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            if ($bright -le $threshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($bright -lt ($threshold + 25)) {
                $alpha = [int]((($bright - $threshold) / 25.0) * $c.A)
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $dest.SetPixel($x, $y, $c)
            }
        }
    }
    return $dest
}

function Remove-WhiteBg($srcBitmap, $threshold = 240) {
    $w = $srcBitmap.Width
    $h = $srcBitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $srcBitmap.GetPixel($x, $y)
            $minC = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
            if ($minC -ge $threshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minC -gt ($threshold - 30)) {
                $alpha = [int](((255 - $minC) / (255 - ($threshold - 30))) * $c.A)
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $dest.SetPixel($x, $y, $c)
            }
        }
    }
    return $dest
}

Write-Output "=== PROCESSING FILE 001 (Rooms & Letter UI) ==="
$f1 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404250.jpg")
$room1 = Crop-Rect $f1 0 0 511 287
Save-Png $room1 "assets\bg\bg_room1.png"
Save-Png $room1 "assets\bg\bg_room1_clean.png"
$room1.Dispose()

$room2 = Crop-Rect $f1 513 0 511 287
Save-Png $room2 "assets\bg\bg_room2.png"
Save-Png $room2 "assets\bg\bg_room2_clean.png"
$room2.Dispose()

$room3 = Crop-Rect $f1 0 289 511 287
Save-Png $room3 "assets\bg\bg_room3.png"
Save-Png $room3 "assets\bg\bg_room3_clean.png"
$room3.Dispose()

# Bottom Right quadrant: x: 513 to 1024, y: 289 to 576
$q4 = Crop-Rect $f1 513 289 511 287
# Frame: x: 5 to 200 of q4
$frameCrop = Crop-Rect $q4 5 10 200 270
$frameClean = Remove-DarkBg $frameCrop 25
Save-Png $frameClean "assets\ui\modal_frame.png"
$frameClean.Dispose()
$frameCrop.Dispose()

# Letter paper: x: 205 to 400 of q4
$paperCrop = Crop-Rect $q4 205 10 200 270
$paperClean = Remove-DarkBg $paperCrop 25
Save-Png $paperClean "assets\ui\letter_paper.png"
$paperClean.Dispose()
$paperCrop.Dispose()

# Feather pen: x: 405 to 505 of q4
$penCrop = Crop-Rect $q4 405 50 100 220
$penClean = Remove-DarkBg $penCrop 25
Save-Png $penClean "assets\ui\feather_pen.png"
$penClean.Dispose()
$penCrop.Dispose()

$q4.Dispose()
$f1.Dispose()

Write-Output "=== PROCESSING FILE 003 (Lock Modals) ==="
$f3 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425403892.jpg")
$lockWood = Crop-Rect $f3 0 0 511 286
Save-Png $lockWood "assets\ui\lock_wooden.png"
$lockWood.Dispose()

$lockJewel = Crop-Rect $f3 513 0 511 286
Save-Png $lockJewel "assets\ui\lock_jewelry.png"
$lockJewel.Dispose()

$lockSafe = Crop-Rect $f3 0 289 511 286
Save-Png $lockSafe "assets\ui\lock_safe.png"
$lockSafe.Dispose()

$lockChest = Crop-Rect $f3 513 289 511 286
Save-Png $lockChest "assets\ui\lock_chest.png"
$lockChest.Dispose()
$f3.Dispose()

Write-Output "Part 1 completed successfully!"
