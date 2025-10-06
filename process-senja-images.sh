#!/bin/bash

# ============================================================================
# Senja Image Processing Script
# ============================================================================
# This script processes all Senja images and creates optimized versions for web
#
# IMAGE FORMAT STRATEGY:
# - Primary: WebP (80-85% quality) - 60-80% smaller than JPEG
# - Fallback: JPEG (85-90% quality) - Progressive loading for universal support
# - Color Space: sRGB (standard web)
# - Metadata: Stripped (EXIF, GPS removed for privacy & size)
#
# SIZE VARIANTS:
# 1. Thumbnail (400x300)      - 15-30KB WebP,  25-50KB JPEG
# 2. Medium (800x600)         - 50-100KB WebP, 80-150KB JPEG
# 3. Large Vertical (800x1000)   - 80-150KB WebP, 120-200KB JPEG
# 4. Large Horizontal (1200x800) - 100-200KB WebP, 150-300KB JPEG
# 5. Extra Large (1600x1200)  - 200-400KB WebP, 300-600KB JPEG
#
# OPTIMIZATION:
# - WebP: Method 6 (highest compression, slower encode)
# - JPEG: Progressive (interlaced for faster perceived load)
# - Aspect ratios maintained with smart cropping
# ============================================================================

SOURCE_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja"
OUTPUT_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/processed"
GALLERY_DIR="/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/gallery"

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$GALLERY_DIR"

echo "Processing Senja images..."
echo "Source: $SOURCE_DIR"
echo "Output: $OUTPUT_DIR"

# Counter for naming
counter=1

# Process each image
for image in "$SOURCE_DIR"/*.{JPG,jpg}; do
    if [ -f "$image" ]; then
        # Get filename without extension
        basename=$(basename "$image" | sed 's/\.[^.]*$//')
        
        # Create descriptive name
        new_name="senja-$(printf "%02d" $counter)"
        
        echo "Processing: $(basename "$image") -> $new_name"
        
        # Strip EXIF and convert to sRGB color space
        # Create multiple sizes for each image with optimized quality settings
        
        # 1. Thumbnail (400x300) - Target: 15-30KB WebP, 25-50KB JPEG
        convert "$image" -strip -colorspace sRGB -resize 400x300^ -gravity center -crop 400x300+0+0 +repage -quality 80 -define webp:method=6 -define webp:alpha-quality=100 "${GALLERY_DIR}/${new_name}-400x300.webp"
        convert "$image" -strip -colorspace sRGB -resize 400x300^ -gravity center -crop 400x300+0+0 +repage -quality 85 -interlace Plane "${GALLERY_DIR}/${new_name}-400x300.jpg"
        
        # 2. Medium (800x600) - Target: 50-100KB WebP, 80-150KB JPEG
        convert "$image" -strip -colorspace sRGB -resize 800x600^ -gravity center -crop 800x600+0+0 +repage -quality 85 -define webp:method=6 -define webp:alpha-quality=100 "${GALLERY_DIR}/${new_name}-800x600.webp"
        convert "$image" -strip -colorspace sRGB -resize 800x600^ -gravity center -crop 800x600+0+0 +repage -quality 90 -interlace Plane "${GALLERY_DIR}/${new_name}-800x600.jpg"
        
        # 3. Large Vertical (800x1000) - Target: 80-150KB WebP, 120-200KB JPEG
        convert "$image" -strip -colorspace sRGB -resize 800x1000^ -gravity center -crop 800x1000+0+0 +repage -quality 85 -define webp:method=6 -define webp:alpha-quality=100 "${GALLERY_DIR}/${new_name}-800x1000.webp"
        convert "$image" -strip -colorspace sRGB -resize 800x1000^ -gravity center -crop 800x1000+0+0 +repage -quality 90 -interlace Plane "${GALLERY_DIR}/${new_name}-800x1000.jpg"
        
        # 4. Large Horizontal (1200x800) - Target: 100-200KB WebP, 150-300KB JPEG
        convert "$image" -strip -colorspace sRGB -resize 1200x800^ -gravity center -crop 1200x800+0+0 +repage -quality 85 -define webp:method=6 -define webp:alpha-quality=100 "${GALLERY_DIR}/${new_name}-1200x800.webp"
        convert "$image" -strip -colorspace sRGB -resize 1200x800^ -gravity center -crop 1200x800+0+0 +repage -quality 90 -interlace Plane "${GALLERY_DIR}/${new_name}-1200x800.jpg"
        
        # 5. Extra Large (1600x1200) - Target: 200-400KB WebP, 300-600KB JPEG
        convert "$image" -strip -colorspace sRGB -resize 1600x1200^ -gravity center -crop 1600x1200+0+0 +repage -quality 85 -define webp:method=6 -define webp:alpha-quality=100 "${GALLERY_DIR}/${new_name}-1600x1200.webp"
        convert "$image" -strip -colorspace sRGB -resize 1600x1200^ -gravity center -crop 1600x1200+0+0 +repage -quality 90 -interlace Plane "${GALLERY_DIR}/${new_name}-1600x1200.jpg"
        
        echo "  Created 5 sizes with WebP + JPEG fallbacks"
        
        counter=$((counter + 1))
    fi
done

echo ""
echo "============================================================================"
echo "✓ Image processing complete!"
echo "============================================================================"
echo "Processed $((counter - 1)) images"
echo "Output directory: $GALLERY_DIR"
echo ""
echo "File Size Report (per image):"
echo "----------------------------"
for size in "400x300" "800x600" "800x1000" "1200x800" "1600x1200"; do
    echo ""
    echo "Size: $size"
    webp_files=$(find "$GALLERY_DIR" -name "*-${size}.webp" | head -1)
    jpg_files=$(find "$GALLERY_DIR" -name "*-${size}.jpg" | head -1)
    if [ -f "$webp_files" ]; then
        webp_size=$(du -h "$webp_files" | cut -f1)
        echo "  WebP: ~$webp_size"
    fi
    if [ -f "$jpg_files" ]; then
        jpg_size=$(du -h "$jpg_files" | cut -f1)
        echo "  JPEG: ~$jpg_size"
    fi
done
echo ""
echo "Total gallery size:"
du -sh "$GALLERY_DIR"
echo "============================================================================"
