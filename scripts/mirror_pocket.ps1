Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path (Get-Location).Path "assets"
$srcPath = Join-Path $assetsDir "sprites\teddy_with_bone.png"
$destPath = Join-Path $assetsDir "sprites\teddy_empty.png"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Mirror symmetrical left chest fur (1000 - x)
for ($y = 512; $y -le 618; $y++) {
    for ($x = 510; $x -le 660; $x++) {
        $mirrorX = 1000 - $x
        # Sample left side
        $c = $bmp.GetPixel($mirrorX, $y)
        $bmp.SetPixel($x, $y, $c)
    }
}

$fs = [System.IO.File]::Create($destPath)
$bmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$bmp.Dispose()
Write-Output "Mirrored clean empty pocket!"
