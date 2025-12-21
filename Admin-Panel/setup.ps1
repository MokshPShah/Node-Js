# Create folders
$folders = "views", "assets", "uploads", "config", "models", "routes", "controllers"
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Name $folder -Force
}

# Create .gitignore and add node_modules
"node_modules/" | Out-File -Encoding utf8 .gitignore

Write-Output "Project structure created."
