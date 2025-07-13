#!/bin/bash

echo "🔄 Renaming HEIC files to JPG..."

# Counter for renamed files
count=0

# Find all HEIC files and rename them to JPG
find . -type f \( -name "*.heic" -o -name "*.HEIC" \) | while read file; do
    # Get the new filename with .jpg extension
    newfile="${file%.*}.jpg"
    
    # Check if JPG already exists
    if [ -f "$newfile" ]; then
        echo "⚠️  JPG already exists, removing HEIC: $file"
        rm "$file"
    else
        echo "📝 Renaming: $file → $newfile"
        mv "$file" "$newfile"
        ((count++))
    fi
done

echo "✅ Renamed $count HEIC files to JPG"
echo "📌 Note: These are renamed files, not converted. The actual image format remains HEIC internally."
echo "📌 For production, consider using proper image conversion tools."