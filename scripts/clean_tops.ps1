Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"

function Clean-TopPixels($relPath, $topRows) {
    $fullPath = Join-Path $assetsDir $relPath
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
    $orig = [System.Drawing.Bitmap]::FromStream($ms)
    $w = $orig.Width
    $h = $orig.Height
    
    for ($y = 0; $y -lt $topRows; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $orig.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
    
    $fs = [System.IO.File]::Create($fullPath)
    $orig.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
    $fs.Close()
    $orig.Dispose()
    $ms.Dispose()
    Write-Output "Cleaned top of $relPath"
}

Clean-TopPixels "objects\calendar_2010.png" 22
Clean-TopPixels "objects\calendar.png" 22
Clean-TopPixels "objects\milktea.png" 20
Clean-TopPixels "items\milk_tea.png" 20
