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

# Remove white background with smooth alpha antialiasing
function Remove-WhiteBg($srcBitmap, $whiteThreshold = 246, $softBand = 30) {
    $w = $srcBitmap.Width
    $h = $srcBitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $srcBitmap.GetPixel($x, $y)
            $minC = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
            
            if ($minC -ge $whiteThreshold) {
                # Completely transparent
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minC -gt ($whiteThreshold - $softBand)) {
                # Smooth antialiased border
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

# Trim transparent borders to tight bounding box
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

Write-Output "=== PROCESSING FILE 002 (Gameplay Sprites 3x4) ==="
$f2 = [System.Drawing.Bitmap]::FromFile("$uploadDir\media_1792425404186.jpg")
$cellW = 256
$cellH = 192

# 12 Sprites Matrix: [Row, Col, DestName, AlsoCopy]
$matrix = @(
    @(0, 0, "sprites\dog_guard.png", $null),
    @(0, 1, "sprites\dog_happy.png", $null),
    @(0, 2, "sprites\teddy_full.png", "sprites\teddy_with_bone.png"),
    @(0, 3, "sprites\teddy_empty.png", $null),
    
    @(1, 0, "objects\calendar_2010.png", "objects\calendar.png"),
    @(1, 1, "objects\roses_vase.png", $null),
    @(1, 2, "objects\painting_stars.png", "objects\starry_painting.png"),
    @(1, 3, "objects\milktea.png", "items\milk_tea.png"),
    
    @(2, 0, "objects\paper_voyeu.png", $null),
    @(2, 1, "objects\candle_lit.png", "objects\candle.png"),
    @(2, 2, "objects\switch_box.png", $null),
    @(2, 3, "sprites\husband_avatar.png", "sprites\quin.png")
)

foreach ($item in $matrix) {
    $r = $item[0]
    $c = $item[1]
    $destRel = $item[2]
    $copyRel = $item[3]
    
    $raw = Crop-Rect $f2 ($c * $cellW) ($r * $cellH) $cellW $cellH
    $cleaned = Remove-WhiteBg $raw 245 28
    $raw.Dispose()
    
    # Specific tweaks:
    # 1. Teddy full: add 3rd pink bow on left ear
    if ($destRel -eq "sprites\teddy_full.png" -or $destRel -eq "sprites\teddy_empty.png") {
        # The right ear has bow at x: 160-195, y: 15-45
        # Clone mirrored bow to left ear at x: 60-95, y: 15-45
        $gT = [System.Drawing.Graphics]::FromImage($cleaned)
        $bowCrop = Crop-Rect $cleaned 160 15 35 35
        $bowCrop.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $gT.DrawImage($bowCrop, 62, 18)
        $gT.Dispose()
        $bowCrop.Dispose()
    }
    
    # 2. Painting stars: Remove 1 tiny star so exactly 4 stars remain
    if ($destRel -eq "objects\painting_stars.png") {
        # Inpaint/cover the center small star around x: 128, y: 108 with sky blue
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 60, 115))
        $gP = [System.Drawing.Graphics]::FromImage($cleaned)
        $gP.FillEllipse($brush, 122, 102, 12, 12)
        $brush.Dispose()
        $gP.Dispose()
    }
    
    $cropped = Auto-Crop $cleaned 6
    $cleaned.Dispose()
    
    Save-Png $cropped $destRel
    if ($copyRel) {
        Save-Png $cropped $copyRel
    }
    $cropped.Dispose()
}

$f2.Dispose()
Write-Output "File 002 processed successfully!"
