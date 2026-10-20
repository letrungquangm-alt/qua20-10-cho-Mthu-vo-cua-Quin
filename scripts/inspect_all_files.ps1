Add-Type -AssemblyName System.Drawing

$uploadDir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$files = Get-ChildItem -Path $uploadDir -Filter "media_17924254*.jpg"

foreach ($f in $files) {
    $img = [System.Drawing.Bitmap]::FromFile($f.FullName)
    # Sample top-left, top-right, bottom-left, bottom-right colors
    $cTL = $img.GetPixel(100, 100)
    $cTR = $img.GetPixel(800, 100)
    $cBL = $img.GetPixel(100, 450)
    $cBR = $img.GetPixel(800, 450)
    Write-Output "File: $($f.Name)"
    Write-Output "  TL (100,100): R=$($cTL.R), G=$($cTL.G), B=$($cTL.B)"
    Write-Output "  TR (800,100): R=$($cTR.R), G=$($cTR.G), B=$($cTR.B)"
    Write-Output "  BL (100,450): R=$($cBL.R), G=$($cBL.G), B=$($cBL.B)"
    Write-Output "  BR (800,450): R=$($cBR.R), G=$($cBR.G), B=$($cBR.B)"
    $img.Dispose()
}
