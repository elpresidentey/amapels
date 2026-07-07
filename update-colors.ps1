# Color Scheme Update Script
# Replaces old brown/ivory colors with new white/black/gold scheme

$files = Get-ChildItem -Path "src" -Include "*.tsx","*.ts","*.css" -Recurse

$replacements = @{
    # Background colors
    'bg-ivory' = 'bg-white'
    'bg-brown-dark' = 'bg-black'
    'bg-brown' = 'bg-black-light'
    'bg-champagne' = 'bg-primary-light'
    'bg-sand' = 'bg-gray-100'
    
    # Text colors
    'text-brown-dark' = 'text-black'
    'text-brown/70' = 'text-gray-600'
    'text-brown/60' = 'text-gray-500'
    'text-brown/50' = 'text-gray-400'
    'text-brown' = 'text-black'
    'text-ivory' = 'text-white'
    
    # Border colors
    'border-brown-dark' = 'border-black'
    'border-brown' = 'border-gray-800'
    'border-sand' = 'border-gold'
    
    # Hover states
    'hover:bg-brown-dark' = 'hover:bg-gold'
    'hover:bg-brown' = 'hover:bg-gold'
    'hover:text-brown-dark' = 'hover:text-black'
    'hover:text-brown' = 'hover:text-gold'
    'hover:text-ivory' = 'hover:text-black'
    'hover:border-brown-dark' = 'hover:border-gold'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $updated = $updated -replace $old, $new
    }
    
    if ($content -ne $updated) {
        Set-Content -Path $file.FullName -Value $updated -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nColor scheme update complete!"
Write-Host "Files updated with white/black/gold theme."
