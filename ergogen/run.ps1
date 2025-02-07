Write-Host "Compiling Koala52..."
$lastLine = ""

node ..\src\cli.js . 2>&1 | ForEach-Object { 
    Write-Host $_  # Print output
    if ($_ -match "\S") { $lastLine = $_ }  # Store non-empty last line
}

# Use -match to check for "Done."
if ($lastLine -match "^Done\.") {
    Write-Host "Koala52 compiled successfully. Proceeding with STL generation..."
} else {
    Write-Host "Process failed. Exiting."
    exit
}

# Ensure the STL directory exists
$stlDir = "output/cases/stl"
if (-not (Test-Path -Path $stlDir)) {
    Write-Host "Creating STL directory..."
    New-Item -ItemType Directory -Path $stlDir | Out-Null
}

# Convert all .jscad files to .stl
Write-Host "Processing .jscad files..."
Get-ChildItem "output/cases" -Filter "*.jscad" | ForEach-Object { 
    Write-Host "Converting $($_.Name) to STL..."
    npx @jscad/cli@1 $_.FullName -o "$stlDir/$($_.BaseName).stl" -of stla
}

Write-Host "All files processed successfully!"
