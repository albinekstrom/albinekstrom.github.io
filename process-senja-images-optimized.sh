#!/bin/bash

# ============================================================================
# Senja Image Processing Script - Optimized for Lightweight Gallery
# ============================================================================
# CATEGORY DEFINITIONS:
# Category 1 (Regular vertical): 1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,27,28,29,32,34,35,36
#   - Medium: 400x500 (4:5 ratio) WebP
#   - Large: 800x1000 (4:5 ratio) WebP
#   - Fallback: 800x1000 (4:5 ratio) JPEG
#
# Category 2 (Horizontal): 14,26,30,31,33
#   - Medium: 800x400 (2:1 ratio) WebP
#   - Large: 1600x800 (2:1 ratio) WebP
#   - Fallback: 800x1000 (4:5 ratio) JPEG
#   - Note: Image 14 needs 90° left rotation
#
# Category 3 (Large/Featured): 3,4,17,25
#   - Medium: 400x500 (4:5 ratio) WebP
#   - Large: 800x1000 (4:5 ratio) WebP
#   - Fallback: 800x1000 (4:5 ratio) JPEG
# ============================================================================

SOURCE_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja"
GALLERY_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/gallery"

# Define categories
CATEGORY_2=(14 26 30 31 33)  # Horizontal
CATEGORY_3=(3 4 17 25)        # Large/Featured

# Clear and recreate gallery directory
echo "Clearing old gallery..."
rm -rf "$GALLERY_DIR"
mkdir -p "$GALLERY_DIR"

echo "Processing Senja images from filtered files..."
echo "Source: $SOURCE_DIR"
echo "Output: $GALLERY_DIR"
echo ""

# Helper function to check if image number is in an array
is_in_category() {
    local needle=$1
    shift
    local haystack=("$@")
    for item in "${haystack[@]}"; do
        if [ "$item" -eq "$needle" ]; then
            return 0
        fi
    done
    return 1
}

# First, identify orientation of each image
declare -A image_orientations

for image in "$SOURCE_DIR"/senja-*.{JPG,jpg}; do
    if [ -f "$image" ]; then
        width=$(identify -format "%w" "$image")
        height=$(identify -format "%h" "$image")
        
        if [ "$height" -gt "$width" ]; then
            orientation="vertical"
        else
            orientation="horizontal"
        fi
        
        image_orientations["$image"]="$orientation"
    fi
done

# Counter for naming
counter=1

# Process each image
for image in "$SOURCE_DIR"/senja-*.{JPG,jpg}; do
    if [ -f "$image" ]; then
        new_name="senja-$(printf "%02d" $counter)"
        orientation="${image_orientations[$image]}"
        
        # Determine category
        if is_in_category $counter "${CATEGORY_2[@]}"; then
            category="Category 2 (Horizontal)"
        elif is_in_category $counter "${CATEGORY_3[@]}"; then
            category="Category 3 (Large/Featured)"
        else
            category="Category 1 (Regular)"
        fi
        
        echo "[$counter] Processing: $(basename "$image")"
        echo "    Category: $category"
        echo "    Orientation: $orientation"
        
        # Generate WebP medium size
        if [ "$orientation" = "vertical" ]; then
            # Vertical medium: 400x500 (4:5)
            echo "    Creating: ${new_name}-400x500.webp (medium WebP)"
            convert "$image" \
                -strip \
                -colorspace sRGB \
                -resize 400x500^ \
                -gravity center \
                -crop 400x500+0+0 \
                +repage \
                -quality 78 \
                -define webp:method=6 \
                -define webp:alpha-quality=100 \
                "${GALLERY_DIR}/${new_name}-400x500.webp"
            
            # Vertical large: 800x1000 (4:5)
            echo "    Creating: ${new_name}-800x1000.webp (large WebP)"
            convert "$image" \
                -strip \
                -colorspace sRGB \
                -resize 800x1000^ \
                -gravity center \
                -crop 800x1000+0+0 \
                +repage \
                -quality 80 \
                -define webp:method=6 \
                -define webp:alpha-quality=100 \
                "${GALLERY_DIR}/${new_name}-800x1000.webp"
        else
            # Horizontal medium: 800x400 (2:1)
            echo "    Creating: ${new_name}-800x400.webp (medium WebP)"
            convert "$image" \
                -strip \
                -colorspace sRGB \
                -resize 800x400^ \
                -gravity center \
                -crop 800x400+0+0 \
                +repage \
                -quality 78 \
                -define webp:method=6 \
                -define webp:alpha-quality=100 \
                "${GALLERY_DIR}/${new_name}-800x400.webp"
            
            # Horizontal large: 1600x800 (2:1)
            echo "    Creating: ${new_name}-1600x800.webp (large WebP)"
            convert "$image" \
                -strip \
                -colorspace sRGB \
                -resize 1600x800^ \
                -gravity center \
                -crop 1600x800+0+0 \
                +repage \
                -quality 80 \
                -define webp:method=6 \
                -define webp:alpha-quality=100 \
                "${GALLERY_DIR}/${new_name}-1600x800.webp"
        fi
        
        # Generate single fallback JPEG (800x1000 for all images)
        echo "    Creating: ${new_name}-800x1000.jpg (fallback JPEG)"
        convert "$image" \
            -strip \
            -colorspace sRGB \
            -resize 800x1000^ \
            -gravity center \
            -crop 800x1000+0+0 \
            +repage \
            -quality 85 \
            -interlace Plane \
            "${GALLERY_DIR}/${new_name}-800x1000.jpg"
        
        echo ""
        counter=$((counter + 1))
    fi
done

echo "============================================================================"
echo "✓ Image processing complete!"
echo "============================================================================"
echo "Processed $((counter - 1)) images"
echo ""
echo "Category breakdown:"
echo "  Category 1 (Regular): 400x500 + 800x1000 WebP + 800x1000 JPEG"
echo "  Category 2 (Horizontal): 800x400 + 1600x800 WebP + 800x1000 JPEG - $(echo "${CATEGORY_2[@]}")"
echo "  Category 3 (Featured): 400x500 + 800x1000 WebP + 800x1000 JPEG - $(echo "${CATEGORY_3[@]}")"
echo ""
echo "File Size Report:"
echo "----------------------------"
echo ""

echo "Sample WebP files:"
find "$GALLERY_DIR" -name "*.webp" | head -3 | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "  $(basename "$file"): $size"
done

echo ""
echo "Sample JPEG files:"
find "$GALLERY_DIR" -name "*.jpg" | head -3 | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "  $(basename "$file"): $size"
done

echo ""
echo "Total gallery size:"
du -sh "$GALLERY_DIR"
echo ""
echo "Image count:"
echo "  WebP files: $(find "$GALLERY_DIR" -name "*.webp" | wc -l)"
echo "  JPEG files: $(find "$GALLERY_DIR" -name "*.jpg" | wc -l)"
echo "  Total: $(ls -1 "$GALLERY_DIR" | wc -l) files"
echo "============================================================================"
