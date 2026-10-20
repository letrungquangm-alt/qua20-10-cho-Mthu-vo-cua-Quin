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

function Remove-BlackBackground($srcBitmap, $threshold = 28) {
    $w = $srcBitmap.Width
    $h = $srcBitmap.Height
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $srcBitmap.GetPixel($x, $y)
            $brightness = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            if ($brightness -le $threshold) {
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($brightness -lt ($threshold + 25)) {
                $alpha = [int]((($brightness - $threshold) / 25.0) * $c.A)
                $dest.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $dest.SetPixel($x, $y, $c)
            }
        }
    }
    return $dest
}

function Crop-Cell($srcBitmap, $col, $row, $innerPadding = 35) {
    $cellW = [int]($srcBitmap.Width / 3)
    $cellH = [int]($srcBitmap.Height / 3)
    
    $x = $col * $cellW + $innerPadding
    $y = $row * $cellH + $innerPadding
    $w = $cellW - ($innerPadding * 2)
    $h = $cellH - ($innerPadding * 2)
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.DrawImage($srcBitmap, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $isolated = Remove-BlackBackground $cropped 32
    $cropped.Dispose()
    return $isolated
}

# --- EXTRACT FROM ITEMS SHEET ---
$itemsImg = [System.Drawing.Bitmap]::FromFile("$brainDir\items_sheet_1792411800605.jpg")

# 1. Brass Key (Col 1, Row 0)
$key = Crop-Cell $itemsImg 1 0 32
Save-Png $key "assets\items\small_key.png"
$key.Dispose()

# 2. Heart Lighter (Col 2, Row 0)
$lighter = Crop-Cell $itemsImg 2 0 32
Save-Png $lighter "assets\items\lighter.png"
$lighter.Dispose()

# 3. Lipstick (Col 1, Row 1)
$lipstick = Crop-Cell $itemsImg 1 1 32
Save-Png $lipstick "assets\items\lipstick.png"
$lipstick.Dispose()

# 4. Milk Tea Cup (Col 2, Row 2)
$milkTea = Crop-Cell $itemsImg 2 2 32
Save-Png $milkTea "assets\objects\milktea.png"
Save-Png $milkTea "assets\items\milk_tea.png"
$milkTea.Dispose()

# 5. Heart Gem Left & Right (Col 0, Row 2)
$heartGem = Crop-Cell $itemsImg 0 2 32
$hw = [int]($heartGem.Width / 2)
$rectL = New-Object System.Drawing.Rectangle(0, 0, $hw, $heartGem.Height)
$rectR = New-Object System.Drawing.Rectangle($hw, 0, $hw, $heartGem.Height)

$heartL = New-Object System.Drawing.Bitmap($hw, $heartGem.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gL = [System.Drawing.Graphics]::FromImage($heartL)
$gL.DrawImage($heartGem, 0, 0, $rectL, [System.Drawing.GraphicsUnit]::Pixel)
$gL.Dispose()
Save-Png $heartL "assets\items\heart_left.png"
$heartL.Dispose()

$heartR = New-Object System.Drawing.Bitmap($hw, $heartGem.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gR = [System.Drawing.Graphics]::FromImage($heartR)
$gR.DrawImage($heartGem, 0, 0, $rectR, [System.Drawing.GraphicsUnit]::Pixel)
$gR.Dispose()
Save-Png $heartR "assets\items\heart_right.png"
$heartR.Dispose()
$heartGem.Dispose()

# 6. Dog bone biscuit (Col 0, Row 0)
$dogBone = Crop-Cell $itemsImg 0 0 32
Save-Png $dogBone "assets\items\dog_bone.png"
$dogBone.Dispose()

$itemsImg.Dispose()
Write-Output "Items extracted successfully!"
