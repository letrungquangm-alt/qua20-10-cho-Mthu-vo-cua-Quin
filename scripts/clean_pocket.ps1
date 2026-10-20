Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$srcPath = Join-Path $assetsDir "sprites\teddy_with_bone.png"
$destPath = Join-Path $assetsDir "sprites\teddy_empty.png"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Bounding box of the fish cookie: x from 508 to 660, y from 520 to 630
# Replace with belly/pocket fur from (x, y + 120)
for ($y = 520; $y -le 630; $y++) {
    for ($x = 508; $x -le 660; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if it's the cookie or its outline
        # Cookie has high R (130-220) and golden tones
        $isCookie = ($c.R -gt 135 -and $c.G -gt 70 -and $c.B -lt 80) -or 
                    ($c.R -gt 85 -and $c.G -lt 60 -and $c.B -lt 55) -or
                    ($c.R -gt 145 -and $c.G -gt 90)
        
        # Don't touch the pink ribbon tail if it overlaps on left
        $isPinkRibbon = ($c.R -gt 150 -and $c.G -lt 110 -and $c.B -gt 100)
        
        if ($isCookie -and !$isPinkRibbon) {
            $sampleY = [Math]::Min($bmp.Height - 1, $y + 120)
            $sampleC = $bmp.GetPixel($x, $sampleY)
            $bmp.SetPixel($x, $y, $sampleC)
        }
    }
}

$fs = [System.IO.File]::Create($destPath)
$bmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$bmp.Dispose()
Write-Output "Successfully updated teddy_empty.png!"
