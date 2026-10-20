Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap(10, 10)
$destPath = Join-Path (Get-Location).Path "assets\test.png"
$fs = [System.IO.File]::Create($destPath)
$b.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$fs.Close()
$b.Dispose()
Write-Output "File exists: $(Test-Path $destPath)"
Remove-Item $destPath
