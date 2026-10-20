Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$baseDir = (Get-Location).Path
$assetsDir = Join-Path $baseDir "assets"

function Save-Png($bitmap, $subPath) {
    $fullPath = Join-Path $assetsDir $subPath
    $dir = [System.IO.Path]::GetDirectoryName($fullPath)
    if (!(Test-Path $dir)) { [System.IO.Directory]::CreateDirectory($dir) | Out-Null }
    
    $fs = [System.IO.File]::Create($fullPath)
    $bitmap.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
    $fs.Close()
    Write-Output "Saved: assets\$subPath ($($bitmap.Width)x$($bitmap.Height))"
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

function Remove-DarkBg($srcBitmap, $threshold = 28) {
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
    
    return Crop-Rect $bitmap $x0 $y0 $w $h
}

Write-Output "=========================================="
Write-Output "STARTING FULL PIPELINE PROCESSING"
Write-Output "=========================================="

# ----------------------------------------------------
# 1. FILE 001: media_1792425404250.jpg (Rooms & Letter UI)
# ----------------------------------------------------
Write-Output "`n--- Processing File 001 (Rooms & Letter UI) ---"
$f1 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404250.jpg")
$room1 = Crop-Rect $f1 0 0 511 287
Save-Png $room1 "bg\bg_room1.png"
Save-Png $room1 "bg\bg_room1_clean.png"
$room1.Dispose()

$room2 = Crop-Rect $f1 513 0 511 287
Save-Png $room2 "bg\bg_room2.png"
Save-Png $room2 "bg\bg_room2_clean.png"
$room2.Dispose()

$room3 = Crop-Rect $f1 0 289 511 287
Save-Png $room3 "bg\bg_room3.png"
Save-Png $room3 "bg\bg_room3_clean.png"
$room3.Dispose()

$q4 = Crop-Rect $f1 513 289 511 287
$frameCrop = Crop-Rect $q4 5 10 200 270
$frameClean = Remove-DarkBg $frameCrop 25
Save-Png $frameClean "ui\modal_frame.png"
$frameClean.Dispose()
$frameCrop.Dispose()

$paperCrop = Crop-Rect $q4 205 10 200 270
$paperClean = Remove-DarkBg $paperCrop 25
Save-Png $paperClean "ui\letter_paper.png"
$paperClean.Dispose()
$paperCrop.Dispose()

$penCrop = Crop-Rect $q4 405 50 100 220
$penClean = Remove-DarkBg $penCrop 25
Save-Png $penClean "ui\feather_pen.png"
$penClean.Dispose()
$penCrop.Dispose()
$q4.Dispose()
$f1.Dispose()

# ----------------------------------------------------
# 2. FILE 003: media_1792425403892.jpg (Lock Modals)
# ----------------------------------------------------
Write-Output "`n--- Processing File 003 (Lock Modals) ---"
$f3 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425403892.jpg")
$lockWood = Crop-Rect $f3 0 0 511 286
Save-Png $lockWood "ui\lock_wooden.png"
$lockWood.Dispose()

$lockJewel = Crop-Rect $f3 513 0 511 286
Save-Png $lockJewel "ui\lock_jewelry.png"
$lockJewel.Dispose()

$lockSafe = Crop-Rect $f3 0 289 511 286
Save-Png $lockSafe "ui\lock_safe.png"
$lockSafe.Dispose()

$lockChest = Crop-Rect $f3 513 289 511 286
Save-Png $lockChest "ui\lock_chest.png"
$lockChest.Dispose()
$f3.Dispose()

# ----------------------------------------------------
# 3. FILE 002: media_1792425404186.jpg (Hotspots 3x4)
# ----------------------------------------------------
Write-Output "`n--- Processing File 002 (Gameplay Hotspots 3x4) ---"
$f2 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404186.jpg")
$cellW = 256
$cellH = 192

$matrix2 = @(
    @{ R = 0; C = 0; Dest = "sprites\dog_guard.png"; Extra = $null },
    @{ R = 0; C = 1; Dest = "sprites\dog_happy.png"; Extra = $null },
    @{ R = 0; C = 2; Dest = "sprites\teddy_full.png"; Extra = "sprites\teddy_with_bone.png" },
    @{ R = 0; C = 3; Dest = "sprites\teddy_empty.png"; Extra = $null },
    @{ R = 1; C = 0; Dest = "objects\calendar_2010.png"; Extra = "objects\calendar.png" },
    @{ R = 1; C = 1; Dest = "objects\roses_vase.png"; Extra = $null },
    @{ R = 1; C = 2; Dest = "objects\painting_stars.png"; Extra = "objects\starry_painting.png" },
    @{ R = 1; C = 3; Dest = "objects\milktea.png"; Extra = "items\milk_tea.png" },
    @{ R = 2; C = 0; Dest = "objects\paper_voyeu.png"; Extra = $null },
    @{ R = 2; C = 1; Dest = "objects\candle_lit.png"; Extra = "objects\candle.png" },
    @{ R = 2; C = 2; Dest = "objects\switch_box.png"; Extra = $null },
    @{ R = 2; C = 3; Dest = "sprites\husband_avatar.png"; Extra = "sprites\quin.png" }
)

foreach ($item in $matrix2) {
    $raw = Crop-Rect $f2 ($item.C * $cellW) ($item.R * $cellH) $cellW $cellH
    $cleaned = Remove-WhiteBg $raw 245 28
    $raw.Dispose()
    
    # Teddy: add 3rd bow on left ear
    if ($item.Dest -like "*teddy*") {
        $gT = [System.Drawing.Graphics]::FromImage($cleaned)
        $bowCrop = Crop-Rect $cleaned 160 15 35 35
        $bowCrop.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $gT.DrawImage($bowCrop, 62, 18)
        $gT.Dispose()
        $bowCrop.Dispose()
    }
    
    # Stars: remove center tiny star so exactly 4 stars remain
    if ($item.Dest -like "*painting*") {
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 60, 115))
        $gP = [System.Drawing.Graphics]::FromImage($cleaned)
        $gP.FillEllipse($brush, 122, 102, 12, 12)
        $brush.Dispose()
        $gP.Dispose()
    }
    
    $cropped = Auto-Crop $cleaned 6
    $cleaned.Dispose()
    
    Save-Png $cropped $item.Dest
    if ($item.Extra) {
        Save-Png $cropped $item.Extra
    }
    $cropped.Dispose()
}
$f2.Dispose()

# ----------------------------------------------------
# 4. FILE 004: media_1792425404087.jpg (Inventory & Rewards)
# ----------------------------------------------------
Write-Output "`n--- Processing File 004 (Inventory & Rewards) ---"
$f4 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404087.jpg")

function Extract-Item($srcImg, $x, $y, $w, $h, $destSub, $extraSub = $null) {
    $raw = Crop-Rect $srcImg $x $y $w $h
    $cleaned = Remove-WhiteBg $raw 245 28
    $raw.Dispose()
    $cropped = Auto-Crop $cleaned 4
    $cleaned.Dispose()
    Save-Png $cropped $destSub
    if ($extraSub) {
        Save-Png $cropped $extraSub
    }
    $cropped.Dispose()
}

# Row 1:
Extract-Item $f4 60 60 210 140 "items\dog_food.png" "items\dog_bone.png"
Extract-Item $f4 320 60 180 150 "items\small_key.png"
Extract-Item $f4 520 60 160 150 "items\lighter.png"
Extract-Item $f4 700 50 80 150 "items\lipstick.png"
Extract-Item $f4 805 80 150 120 "items\heart_gem.png"

# Row 2:
# Bouquet: x: 30, y: 350, w: 290, h: 220. Note: tag is at x: 180-295, y: 490-560
$bouquetRaw = Crop-Rect $f4 30 350 290 226
# Inpaint/erase tag with transparent/white before background removal
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$gBq = [System.Drawing.Graphics]::FromImage($bouquetRaw)
$gBq.FillRectangle($brushWhite, 175, 140, 115, 86)
$brushWhite.Dispose()
$gBq.Dispose()
$bouquetClean = Remove-WhiteBg $bouquetRaw 245 28
$bouquetRaw.Dispose()
$bouquetFinal = Auto-Crop $bouquetClean 6
$bouquetClean.Dispose()
Save-Png $bouquetFinal "ui\bouquet_reveal.png"
Save-Png $bouquetFinal "sprites\bouquet_bloom.png"
$bouquetFinal.Dispose()

# Battery:
Extract-Item $f4 330 375 160 125 "items\battery.png"

# Heart Locket Pair:
$locketRaw = Crop-Rect $f4 510 375 180 125
$locketClean = Remove-WhiteBg $locketRaw 245 28
$locketRaw.Dispose()
# Split left and right half
$lw = [int]($locketClean.Width / 2)
$locketL = Crop-Rect $locketClean 0 0 $lw $locketClean.Height
Save-Png (Auto-Crop $locketL 2) "items\heart_left.png"
$locketL.Dispose()

$locketR = Crop-Rect $locketClean $lw 0 $lw $locketClean.Height
Save-Png (Auto-Crop $locketR 2) "items\heart_right.png"
$locketR.Dispose()
$locketClean.Dispose()

# Dashed Heart Slots:
Extract-Item $f4 715 375 240 125 "ui\heart_slot_dashed.png"

# Row 3 (Closed Boxes):
Extract-Item $f4 335 670 170 140 "sprites\wooden_box_closed.png" "objects\wooden_box.png"
Extract-Item $f4 525 670 170 140 "sprites\jewelry_box_closed.png" "objects\jewelry_box.png"
Extract-Item $f4 710 580 250 240 "sprites\chest_closed.png" "objects\chest.png"
$f4.Dispose()

# ----------------------------------------------------
# 5. FILE 005: media_1792425404310.jpg (UI & Controls)
# ----------------------------------------------------
Write-Output "`n--- Processing File 005 (UI Buttons & Controls) ---"
$f5 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404310.jpg")

# Slot frames:
Extract-Item $f5 25 30 150 155 "ui\slot_normal.png" "ui\slot_bg.png"
Extract-Item $f5 175 25 180 165 "ui\slot_selected.png"

# Wooden Arrows:
Extract-Item $f5 385 60 130 90 "ui\arrow_wood_left.png"
Extract-Item $f5 530 60 130 90 "ui\arrow_wood_right.png"

# Dial Buttons ▲ ▼:
Extract-Item $f5 775 60 90 75 "ui\dial_up.png"
Extract-Item $f5 775 140 90 85 "ui\dial_down.png"

# Inpaint Brass Number Wheel (x: 885 to 975, y: 60 to 235):
$wheelRaw = Crop-Rect $f5 885 60 90 175
# Sample blank bronze surface from x: 10, y: 155
$gW = [System.Drawing.Graphics]::FromImage($wheelRaw)
$bronzeBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(90, 0)),
    [System.Drawing.Color]::FromArgb(255, 195, 160, 100),
    [System.Drawing.Color]::FromArgb(255, 140, 105, 55)
)
# Inpaint slots over numbers 1, 2, 3:
$gW.FillRectangle($bronzeBrush, 24, 30, 42, 38)
$gW.FillRectangle($bronzeBrush, 24, 76, 42, 38)
$gW.FillRectangle($bronzeBrush, 24, 122, 42, 38)
$bronzeBrush.Dispose()
$gW.Dispose()
$wheelClean = Remove-WhiteBg $wheelRaw 245 28
$wheelRaw.Dispose()
Save-Png (Auto-Crop $wheelClean 4) "ui\brass_wheel_blank.png"
$wheelClean.Dispose()

# Row 2 (Pills & Keyholes):
Extract-Item $f5 25 205 155 85 "ui\btn_hint_pill.png"
Extract-Item $f5 190 205 155 85 "ui\btn_music_pill.png"
Extract-Item $f5 385 165 140 100 "ui\arrow_glow_left.png"
Extract-Item $f5 525 165 140 100 "ui\arrow_glow_right.png"

Extract-Item $f5 770 240 95 95 "ui\keyhole_locked.png"
Extract-Item $f5 755 335 95 95 "ui\keyhole_unlocked.png"
Extract-Item $f5 880 245 95 95 "ui\padlock_icon.png"
Extract-Item $f5 855 345 120 80 "ui\key_icon.png"

# Row 3 (6 Gold Medallions):
Extract-Item $f5 25 315 110 110 "ui\icon_rose.png"
Extract-Item $f5 145 315 110 110 "ui\icon_crown.png"
Extract-Item $f5 265 315 110 110 "ui\icon_heart.png"
Extract-Item $f5 385 315 110 110 "ui\icon_ring.png"
Extract-Item $f5 520 315 110 110 "ui\icon_clover.png"
Extract-Item $f5 635 315 110 110 "ui\icon_star.png"

# Row 4 (Keycaps & Wide Button):
Extract-Item $f5 25 440 110 105 "ui\keycap_cream.png"
Extract-Item $f5 145 440 110 105 "ui\keycap_brown.png"
Extract-Item $f5 260 440 110 105 "ui\keycap_gold.png"
Extract-Item $f5 375 440 110 105 "ui\keycap_blue.png"
Extract-Item $f5 495 440 110 105 "ui\keycap_pink.png"
Extract-Item $f5 610 440 110 105 "ui\keycap_bronze.png"
Extract-Item $f5 730 445 245 100 "ui\btn_submit_wide.png"

$f5.Dispose()

# ----------------------------------------------------
# 6. GENERATE REEL 0 TO 9 (assets/ui/reel_0_to_9.png)
# ----------------------------------------------------
Write-Output "`n--- Generating Interactive Reel 0 to 9 ---"
$reelW = 60
$cellH = 70
$reelH = $cellH * 10
$reelBmp = New-Object System.Drawing.Bitmap($reelW, $reelH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gR = [System.Drawing.Graphics]::FromImage($reelBmp)
$gR.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gR.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$numFont = New-Object System.Drawing.Font("Georgia", 36, [System.Drawing.FontStyle]::Bold)
$engravedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 60, 35, 20))
$highlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 240, 200))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

for ($i = 0; $i -le 9; $i++) {
    $yCenter = $i * $cellH
    $rectHigh = New-Object System.Drawing.RectangleF(0, $yCenter + 2, $reelW, $cellH)
    $rectEng = New-Object System.Drawing.RectangleF(0, $yCenter, $reelW, $cellH)
    # Engraved bottom highlight
    $gR.DrawString("$i", $numFont, $highlightBrush, $rectHigh, $sf)
    # Deep bronze character
    $gR.DrawString("$i", $numFont, $engravedBrush, $rectEng, $sf)
}
$gR.Dispose()
$numFont.Dispose()
$engravedBrush.Dispose()
$highlightBrush.Dispose()
Save-Png $reelBmp "ui\reel_0_to_9.png"
$reelBmp.Dispose()

Write-Output "`n=========================================="
Write-Output "ALL ASSETS SLICED AND SAVED TO ASSETS/!"
Write-Output "=========================================="
