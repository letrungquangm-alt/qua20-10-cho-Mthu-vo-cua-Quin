Add-Type -AssemblyName System.Drawing

$brainDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2"
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

function Remove-DarkBorders($bitmap, $threshold = 28) {
    $w = $bitmap.Width
    $h = $bitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $bitmap.GetPixel($x, $y)
            $bright = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            if ($bright -le $threshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($bright -lt ($threshold + 25)) {
                $alpha = [int]((($bright - $threshold) / 25.0) * 255)
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $dest.SetPixel($x, $y, $c)
            }
        }
    }
    return $dest
}

# 1. ROOM 1 BACKGROUND (Clean Room with empty spots)
Write-Output "--- Processing Room 1 Background ---"
$bg1 = [System.Drawing.Bitmap]::FromFile("$brainDir\bg_room1_gen_1792416170866.jpg")
Save-Png $bg1 "assets\bg\bg_room1.png"
$bg1.Dispose()

# 2. SAFE OBJECT (assets/objects/safe.png)
Write-Output "--- Extracting Safe ---"
$safeFull = [System.Drawing.Bitmap]::FromFile("$brainDir\lock_safe_1792411720078.jpg")
# Safe box is centered: x: 295, y: 95, w: 605, h: 720
$safeCrop = Crop-Rect $safeFull 290 90 615 725
# Add soft transparent rounded border
$safeObj = New-Object System.Drawing.Bitmap($safeCrop.Width, $safeCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 45
$d = $r * 2
$w = $safeCrop.Width
$h = $safeCrop.Height
$path.AddArc(0, 0, $d, $d, 180, 90)
$path.AddArc($w - $d, 0, $d, $d, 270, 90)
$path.AddArc($w - $d, $h - $d, $d, $d, 0, 90)
$path.AddArc(0, $h - $d, $d, $d, 90, 90)
$path.CloseFigure()

$gSafe = [System.Drawing.Graphics]::FromImage($safeObj)
$gSafe.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gSafe.SetClip($path)
$gSafe.DrawImage($safeCrop, 0, 0)
$gSafe.Dispose()
$path.Dispose()
$safeCrop.Dispose()
$safeFull.Dispose()
Save-Png $safeObj "assets\objects\safe.png"
$safeObj.Dispose()

# 3. CHEST OBJECT (assets/objects/chest.png)
Write-Output "--- Extracting Treasure Chest ---"
$chestFull = [System.Drawing.Bitmap]::FromFile("$brainDir\lock_chest_1792411746876.jpg")
# The chest itself is from x: 200, y: 250, w: 800, h: 580
$chestCrop = Crop-Rect $chestFull 200 250 800 580
# Soft edge mask for chest
$chestObj = New-Object System.Drawing.Bitmap($chestCrop.Width, $chestCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$pathChest = New-Object System.Drawing.Drawing2D.GraphicsPath
$rC = 50
$dC = $rC * 2
$pathChest.AddArc(0, 0, $dC, $dC, 180, 90)
$pathChest.AddArc($chestCrop.Width - $dC, 0, $dC, $dC, 270, 90)
$pathChest.AddArc($chestCrop.Width - $dC, $chestCrop.Height - $dC, $dC, $dC, 0, 90)
$pathChest.AddArc(0, $chestCrop.Height - $dC, $dC, $dC, 90, 90)
$pathChest.CloseFigure()
$gChest = [System.Drawing.Graphics]::FromImage($chestObj)
$gChest.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gChest.SetClip($pathChest)
$gChest.DrawImage($chestCrop, 0, 0)
$gChest.Dispose()
$pathChest.Dispose()
$chestCrop.Dispose()
$chestFull.Dispose()
Save-Png $chestObj "assets\objects\chest.png"
$chestObj.Dispose()

# 4. WOODEN BOX OBJECT (assets/objects/wooden_box.png)
Write-Output "--- Extracting Wooden Box ---"
$woodFull = [System.Drawing.Bitmap]::FromFile("$brainDir\lock_wooden_1792411665930.jpg")
# The box is from x: 170, y: 180, w: 860, h: 635
$woodCrop = Crop-Rect $woodFull 170 180 860 635
$woodObj = New-Object System.Drawing.Bitmap($woodCrop.Width, $woodCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$pathW = New-Object System.Drawing.Drawing2D.GraphicsPath
$rW = 35
$dW = $rW * 2
$pathW.AddArc(0, 0, $dW, $dW, 180, 90)
$pathW.AddArc($woodCrop.Width - $dW, 0, $dW, $dW, 270, 90)
$pathW.AddArc($woodCrop.Width - $dW, $woodCrop.Height - $dW, $dW, $dW, 0, 90)
$pathW.AddArc(0, $woodCrop.Height - $dW, $dW, $dW, 90, 90)
$pathW.CloseFigure()
$gW = [System.Drawing.Graphics]::FromImage($woodObj)
$gW.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gW.SetClip($pathW)
$gW.DrawImage($woodCrop, 0, 0)
$gW.Dispose()
$pathW.Dispose()
$woodCrop.Dispose()
$woodFull.Dispose()
Save-Png $woodObj "assets\objects\wooden_box.png"
$woodObj.Dispose()

# 5. JEWELRY BOX OBJECT (assets/objects/jewelry_box.png)
Write-Output "--- Extracting Jewelry Box ---"
$jewelFull = [System.Drawing.Bitmap]::FromFile("$brainDir\lock_jewelry_1792411690870.jpg")
# The box is from x: 150, y: 180, w: 720, h: 730
$jewelCrop = Crop-Rect $jewelFull 150 180 720 730
$jewelObj = New-Object System.Drawing.Bitmap($jewelCrop.Width, $jewelCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$pathJ = New-Object System.Drawing.Drawing2D.GraphicsPath
$rJ = 40
$dJ = $rJ * 2
$pathJ.AddArc(0, 0, $dJ, $dJ, 180, 90)
$pathJ.AddArc($jewelCrop.Width - $dJ, 0, $dJ, $dJ, 270, 90)
$pathJ.AddArc($jewelCrop.Width - $dJ, $jewelCrop.Height - $dJ, $dJ, $dJ, 0, 90)
$pathJ.AddArc(0, $jewelCrop.Height - $dJ, $dJ, $dJ, 90, 90)
$pathJ.CloseFigure()
$gJ = [System.Drawing.Graphics]::FromImage($jewelObj)
$gJ.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gJ.SetClip($pathJ)
$gJ.DrawImage($jewelCrop, 0, 0)
$gJ.Dispose()
$pathJ.Dispose()
$jewelCrop.Dispose()
$jewelFull.Dispose()
Save-Png $jewelObj "assets\objects\jewelry_box.png"
$jewelObj.Dispose()

# 6. ITEMS FROM ITEMS SHEET (Isolated items with no border boxes)
Write-Output "--- Extracting Clean Isolated Items ---"
$itemsFull = [System.Drawing.Bitmap]::FromFile("$brainDir\items_sheet_1792411800605.jpg")

# Milk Tea (Bottom Right: x: 735, y: 655, w: 180, h: 280)
$mtCrop = Crop-Rect $itemsFull 730 650 190 290
$mtClean = Remove-DarkBorders $mtCrop 35
Save-Png $mtClean "assets\objects\milktea.png"
Save-Png $mtClean "assets\items\milk_tea.png"
$mtClean.Dispose()
$mtCrop.Dispose()

# Small Brass Key (Top Middle: x: 405, y: 95, w: 200, h: 200)
$keyCrop = Crop-Rect $itemsFull 400 90 210 210
$keyClean = Remove-DarkBorders $keyCrop 32
Save-Png $keyClean "assets\items\small_key.png"
$keyClean.Dispose()
$keyCrop.Dispose()

# Heart Lighter (Top Right: x: 730, y: 70, w: 190, h: 235)
$lightCrop = Crop-Rect $itemsFull 725 65 200 245
$lightClean = Remove-DarkBorders $lightCrop 32
Save-Png $lightClean "assets\items\lighter.png"
$lightClean.Dispose()
$lightCrop.Dispose()

# Lipstick (Center: x: 400, y: 385, w: 195, h: 235)
$lipCrop = Crop-Rect $itemsFull 395 380 205 245
$lipClean = Remove-DarkBorders $lipCrop 32
Save-Png $lipClean "assets\items\lipstick.png"
$lipClean.Dispose()
$lipCrop.Dispose()

# Heart Crystal (Bottom Left: x: 70, y: 705, w: 220, h: 220)
$gemCrop = Crop-Rect $itemsFull 65 700 230 230
$gemClean = Remove-DarkBorders $gemCrop 32
# Split in half
$ghw = [int]($gemClean.Width / 2)
$gemL = Crop-Rect $gemClean 0 0 $ghw $gemClean.Height
Save-Png $gemL "assets\items\heart_left.png"
$gemL.Dispose()

$gemR = Crop-Rect $gemClean $ghw 0 $ghw $gemClean.Height
Save-Png $gemR "assets\items\heart_right.png"
$gemR.Dispose()
$gemClean.Dispose()
$gemCrop.Dispose()

# Fish / Bone biscuit (Top Left: x: 65, y: 105, w: 230, h: 170)
$boneCrop = Crop-Rect $itemsFull 60 100 240 180
$boneClean = Remove-DarkBorders $boneCrop 32
Save-Png $boneClean "assets\items\dog_bone.png"
Save-Png $boneClean "assets\items\cat_food.png"
$boneClean.Dispose()
$boneCrop.Dispose()

$itemsFull.Dispose()

# 7. PARCHMENT CALENDAR (assets/objects/calendar.png)
Write-Output "--- Rendering High Detail Calendar ---"
$calW = 500
$calH = 650
$calBmp = New-Object System.Drawing.Bitmap($calW, $calH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gCal = [System.Drawing.Graphics]::FromImage($calBmp)
$gCal.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gCal.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Drop shadow
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 0, 0, 0))
$gCal.FillRectangle($shadowBrush, 28, 38, 444, 584)
$shadowBrush.Dispose()

# Red Wooden / Brass Top Hanger
$hangerBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 20)),
    (New-Object System.Drawing.Point(0, 80)),
    [System.Drawing.Color]::FromArgb(255, 180, 40, 60),
    [System.Drawing.Color]::FromArgb(255, 120, 15, 30)
)
$gCal.FillRectangle($hangerBrush, 20, 20, 460, 65)
$hangerBrush.Dispose()

# Gold Ring Peg
$goldRing = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 190, 80))
$gCal.FillEllipse($goldRing, 235, 5, 30, 30)
$innerRing = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
# Clear center of ring
$gCal.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$gCal.FillEllipse($innerRing, 243, 13, 14, 14)
$gCal.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
$goldRing.Dispose()
$innerRing.Dispose()

# Parchment Body
$paperBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 85)),
    (New-Object System.Drawing.Point(0, 600)),
    [System.Drawing.Color]::FromArgb(255, 255, 252, 245),
    [System.Drawing.Color]::FromArgb(255, 245, 235, 220)
)
$gCal.FillRectangle($paperBrush, 20, 85, 460, 520)
$paperBrush.Dispose()

# Border Line
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 210, 180, 140), 3)
$gCal.DrawRectangle($borderPen, 20, 20, 460, 585)
$borderPen.Dispose()

# Calendar Content
$titleFont = New-Object System.Drawing.Font("Georgia", 24, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 240, 230))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$gCal.DrawString("THÁNG 10", $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF(20, 20, 460, 65)), $sf)

# Huge Big Date "20"
$dateFont = New-Object System.Drawing.Font("Georgia", 110, [System.Drawing.FontStyle]::Bold)
$dateBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 30, 50))
$gCal.DrawString("20", $dateFont, $dateBrush, (New-Object System.Drawing.RectangleF(20, 120, 460, 240)), $sf)

# Day of week
$dowFont = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$dowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 110, 80, 60))
$gCal.DrawString("NGÀY PHỤ NỮ VIỆT NAM", $dowFont, $dowBrush, (New-Object System.Drawing.RectangleF(20, 370, 460, 50)), $sf)

# Golden Dedication Text
$dedFont = New-Object System.Drawing.Font("Georgia", 26, [System.Drawing.FontStyle]::Italic)
$dedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 120, 20))
$gCal.DrawString("♥ NGÀY CỦA VỢ YÊU MTHƯ ♥", $dedFont, $dedBrush, (New-Object System.Drawing.RectangleF(20, 440, 460, 60)), $sf)

# Subtitle
$subFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 140, 110, 90))
$gCal.DrawString("(Nhấp vào để lật mở bí mật phía sau)", $subFont, $subBrush, (New-Object System.Drawing.RectangleF(20, 510, 460, 40)), $sf)

$gCal.Dispose()
Save-Png $calBmp "assets\objects\calendar.png"
$calBmp.Dispose()

# 8. BLOOMING BOUQUET (assets/sprites/bouquet_bloom.png)
Write-Output "--- Extracting Blooming Bouquet ---"
# From lock_chest roses (Right & Left blooming roses)
$roseCrop = Crop-Rect $chestFull 720 400 450 480
$roseBmp = New-Object System.Drawing.Bitmap($roseCrop.Width, $roseCrop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$pathR = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathR.AddEllipse(20, 20, $roseCrop.Width - 40, $roseCrop.Height - 40)
$gRose = [System.Drawing.Graphics]::FromImage($roseBmp)
$gRose.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gRose.SetClip($pathR)
$gRose.DrawImage($roseCrop, 0, 0)
$gRose.Dispose()
$pathR.Dispose()
$roseCrop.Dispose()
Save-Png $roseBmp "assets\sprites\bouquet_bloom.png"
$roseBmp.Dispose()

Write-Output "ALL ASSETS EXTRACTED AND BUILT SUCCESSFULLY!"
