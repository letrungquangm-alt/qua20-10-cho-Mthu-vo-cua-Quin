Add-Type -AssemblyName System.Drawing

$dir = "G:\MThu\Apps\Antigravity IDE\data\.gemini\antigravity-ide\brain\15ba4792-e4d3-4fde-b522-4327cfd480c2\.user_uploaded"
$files = Get-ChildItem -Path $dir -Filter "media_17924254*.jpg"

foreach ($f in $files) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    Write-Output "$($f.Name) : $($img.Width) x $($img.Height) ($($f.Length) bytes)"
    $img.Dispose()
}
