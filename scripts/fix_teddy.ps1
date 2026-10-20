Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$brainDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2"

$origTeddy = [System.Drawing.Bitmap]::FromFile("$brainDir\teddy_bear_1792411592279.jpg")
$w = $origTeddy.Width
$h = $origTeddy.Height

function Process-Teddy($hasTreat) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $c = $origTeddy.GetPixel($x, $y)
            $bright = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            
            # Transparent background
            if ($bright -le 24) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                continue
            }
            
            # If removing treat, clone chest fur from symmetric left side (x - 170)
            if (!$hasTreat -and ($x -ge 505 -and $x -le 665 -and $y -ge 515 -and $y -le 635)) {
                # Source pixel from left chest fur
                $srcX = [Math]::Max(100, $x - 165)
                $srcC = $origTeddy.GetPixel($srcX, $y)
                # Brown tint
                $r = [int]($srcC.R * 0.70)
                $g = [int]($srcC.G * 0.48)
                $b = [int]($srcC.B * 0.36)
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($srcC.A, $r, $g, $b))
                continue
            }
            
            # Keep pink bows vibrant
            $isPink = ($c.R -gt 160 -and $c.G -lt 150 -and $c.B -gt 120 -and ($c.R - $c.G) -gt 30)
            
            # Snout & muzzle only (oval around nose/mouth)
            $dx = ($x - 500) / 100.0
            $dy = ($y - 325) / 65.0
            $isMuzzle = (($dx * $dx + $dy * $dy) -le 1.0)
            
            # Eyes & Nose black/dark
            $isDarkFeature = ($c.R -lt 70 -and $c.G -lt 70 -and $c.B -lt 70 -and $y -ge 220 -and $y -le 350)
            
            if ($isPink -or $isDarkFeature) {
                $bmp.SetPixel($x, $y, $c)
            } elseif ($isMuzzle) {
                # Cute warm cream muzzle
                $bmp.SetPixel($x, $y, $c)
            } else {
                # Uniform warm chocolate fur
                $r = [int]($c.R * 0.70)
                $g = [int]($c.G * 0.48)
                $b = [int]($c.B * 0.36)
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $r, $g, $b))
            }
        }
    }
    return $bmp
}

$teddyWithBone = Process-Teddy $true
$fs1 = [System.IO.File]::Create((Join-Path $assetsDir "sprites\teddy_with_bone.png"))
$teddyWithBone.Save($fs1, [System.Drawing.Imaging.ImageFormat]::Png)
$fs1.Close()
$teddyWithBone.Dispose()
Write-Output "Saved teddy_with_bone.png"

$teddyEmpty = Process-Teddy $false
$fs2 = [System.IO.File]::Create((Join-Path $assetsDir "sprites\teddy_empty.png"))
$teddyEmpty.Save($fs2, [System.Drawing.Imaging.ImageFormat]::Png)
$fs2.Close()
$teddyEmpty.Dispose()
Write-Output "Saved teddy_empty.png"

$origTeddy.Dispose()
