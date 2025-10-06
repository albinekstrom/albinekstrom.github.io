#!/bin/bash

# ============================================================================
# Senja Image Processing Script - From Original Images (Fixed)
# ============================================================================
# Processes images from org-images folder to create optimized gallery
# ============================================================================

SOURCE_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/org-images"
GALLERY_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/gallery"

# Clear and recreate gallery directory
echo "Clearing old gallery..."
rm -rf "$GALLERY_DIR"
mkdir -p "$GALLERY_DIR"

echo "Processing Senja images from original files..."
echo "Source: $SOURCE_DIR"
echo "Output: $GALLERY_DIR"
echo ""

# Counter for naming
counter=1

# Process each image in numerical order (with zero-padded numbers)
for i in {01..36}; do
    # Try different possible filenames
    image_file=""
    for ext in "JPG" "jpg"; do
        if [ -f "$SOURCE_DIR/senja-${i}.${ext}" ]; then
            image_file="$SOURCE_DIR/senja-${i}.${ext}"
            break
        fi
    done
    
    if [ -z "$image_file" ]; then
        echo "Image senja-${i} not found, skipping..."
        continue
    fi
    
    new_name="senja-$(printf "%02d" $counter)"
    
    # Determine orientation
    width=$(identify -format "%w" "$image_file")
    height=$(identify -format "%h" "$image_file")
    
    if [ "$height" -gt "$width" ]; then
        orientation="vertical"
    else
        orientation="horizontal"
    fi
    
    echo "[$counter] Processing: $(basename "$image_file")"
    echo "    Orientation: $orientation"
    
    # Generate WebP medium size
    if [ "$orientation" = "vertical" ]; then
        # Vertical medium: 400x500 (4:5)
        echo "    Creating: ${new_name}-400x500.webp (medium WebP)"
        convert "$image_file" \
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
        convert "$image_file" \
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
        convert "$image_file" \
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
        convert "$image_file" \
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
    convert "$image_file" \
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
done

echo "============================================================================"
echo "✓ Image processing complete!"
echo "============================================================================"
echo "Processed $((counter - 1)) images from original files"
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
