#!/usr/bin/env python3

# Random Gallery Generator - 2 Column Grid with Random Order and Smart Layout
# Rules:
# 1. Images displayed in random order
# 2. Horizontal images placed in middle of rows
# 3. Each row should be full of images
# 4. Vertical images: 1x1 (one column)
# 5. Horizontal images: 1x2 (two columns)

import os
import random

def generate_random_gallery():
    gallery_dir = "/home/albin/git/nordtrip/assets/media/images/tidigare-resor/senja/gallery"
    
    # Get all available images (we have 25 images: senja-01 to senja-25)
    all_images = []
    for i in range(1, 26):  # We have 25 images
        # Check if image exists
        vertical_medium = f"{gallery_dir}/senja-{i:02d}-400x500.webp"
        horizontal_medium = f"{gallery_dir}/senja-{i:02d}-800x400.webp"
        
        if os.path.exists(vertical_medium):
            all_images.append({'num': i, 'type': 'vertical'})
        elif os.path.exists(horizontal_medium):
            all_images.append({'num': i, 'type': 'horizontal'})
    
    print(f"Found {len(all_images)} images:")
    for img in all_images:
        print(f"  Image {img['num']}: {img['type']}")
    
    # Randomize order
    random.shuffle(all_images)
    
    # Create smart layout plan
    layout = create_smart_layout_plan(all_images)
    
    # Generate HTML
    html_parts = []
    for row_idx, row in enumerate(layout):
        html_parts.append(f'                    <!-- Row {row_idx + 1} -->')
        html_parts.append('                    <div class="gallery-row">')
        
        for slot_idx, slot in enumerate(row):
            if slot is None:
                html_parts.append('                      <div class="gallery-slot gallery-slot--empty"></div>')
            else:
                img_num = slot['num']
                img_type = slot['type']
                
                # Determine image sizes
                if img_type == 'vertical':
                    medium_size = "400x500"
                    large_size = "800x1000"
                    medium_width = "400"
                    large_width = "800"
                    slot_class = "gallery-slot gallery-slot--vertical"
                else:  # horizontal
                    medium_size = "800x400"
                    large_size = "1600x800"
                    medium_width = "800"
                    large_width = "1600"
                    slot_class = "gallery-slot gallery-slot--horizontal"
                
                # Special handling for image 14 (needs rotation) - but we need to find which image is 14
                needs_rotation = False  # We'll determine this based on the original image
                
                img_class = "gallery-image"
                if needs_rotation:
                    img_class += " gallery-image--rotate-left"
                
                # Build srcset
                srcset = f"/assets/media/images/tidigare-resor/senja/gallery/senja-{img_num:02d}-{medium_size}.webp {medium_width}w,\n                            /assets/media/images/tidigare-resor/senja/gallery/senja-{img_num:02d}-{large_size}.webp {large_width}w"
                
                # Generate alt text
                alt_texts = [
                    "Nordtrips Senja-expedition 2024: dramatisk fjällvy med snötäckta toppar och kristallklart vatten, Norge",
                    "Spektakulär alpinvy under Nordtrips Senja-resa 2024: bergskedjor och arktisk natur, Norge",
                    "Landskapsbild från Senja: vidsträckt fjällterräng med spektakulära vyer över havet",
                    "Skidåkning Senja: deltagare i äventyr på Senjas fantastiska skidbackar",
                    "Gruppbild Senja: Nordtrip-deltagare tillsammans i den vackra norska naturen",
                    "Senja naturupplevelse: autentisk fjällmiljö med spektakulära vyer",
                    "Senja panoramavy: vidsträckt landskap med berg och hav",
                    "Senja äventyr: deltagare utforskar den norska fjällmiljön",
                    "Senja natur: vacker fjällmiljö med snö och berg",
                    "Senja upplevelse: deltagare i den fantastiska norska naturen",
                    "Senja landskap: spektakulära vyer över fjorden och bergen",
                    "Senja fjällupplevelse: resenärer i den arktiska naturen",
                    "Senja vinteräventyr: snötäckta toppar och dramatiska vyer",
                    "Senja gruppaktivitet: deltagare i den norska fjällmiljön",
                    "Senja naturlandskap: vidsträckt fjällterräng med havet i bakgrunden",
                    "Senja utomhusäventyr: deltagare utforskar den spektakulära naturen",
                    "Senja fjord: kristallklart vatten omgivet av dramatiska berg",
                    "Senja vinterresa: Nordtrip-deltagare i den arktiska miljön",
                    "Senja panorama: spektakulär utsikt över den norska kusten",
                    "Senja äventyr: deltagare i den fantastiska fjällmiljön",
                    "Senja landskap: vacker natur med snö och berg",
                    "Senja upplevelse: resenärer i den norska vildmarken",
                    "Senja fjällterräng: dramatiska vyer över havet och bergen",
                    "Senja natur: autentisk fjällmiljö med spektakulära landskap",
                    "Senja vinterupplevelse: deltagare i den arktiska naturen"
                ]
                
                alt_text = alt_texts[img_num % len(alt_texts)]
                
                # Determine loading priority (first 3 images)
                if row_idx == 0 and slot_idx == 0:
                    loading_attr = 'fetchpriority="high"'
                    comment_suffix = " (Hero - Eager Load)"
                else:
                    loading_attr = 'loading="lazy"'
                    comment_suffix = ""
                
                html = f'''                      <!-- Slot {slot_idx + 1}: {img_type} (img {img_num}){comment_suffix} -->
                      <div class="{slot_class}">
                        <picture>
                          <source
                            srcset="
                              {srcset}
                            "
                            sizes="(max-width: 768px) 100vw, 50vw"
                            type="image/webp"
                          />
                          <img
                            class="{img_class}"
                            src="/assets/media/images/tidigare-resor/senja/gallery/senja-{img_num:02d}-{medium_size}.jpg"
                            alt="{alt_text}"
                            {loading_attr}
                          />
                        </picture>
                      </div>'''
                
                html_parts.append(html)
        
        html_parts.append('                    </div>')
        html_parts.append('')
    
    return '\n'.join(html_parts)

def create_smart_layout_plan(images):
    """
    Create a smart layout plan that ensures:
    1. Images in random order
    2. Horizontal images placed in middle of rows
    3. Each row is full of images
    4. Horizontal images take 2 columns, vertical take 1 column
    """
    layout = []
    current_row = []
    current_row_width = 0
    max_row_width = 2  # 2 columns
    
    # Separate horizontal and vertical images
    horizontal_images = [img for img in images if img['type'] == 'horizontal']
    vertical_images = [img for img in images if img['type'] == 'vertical']
    
    # Shuffle both lists
    random.shuffle(horizontal_images)
    random.shuffle(vertical_images)
    
    # Create layout by alternating between vertical and horizontal images
    # Place horizontal images in the middle of rows when possible
    all_images = []
    h_idx = 0
    v_idx = 0
    
    # Interleave images: try to place horizontal images in middle positions
    while h_idx < len(horizontal_images) or v_idx < len(vertical_images):
        # If we have horizontal images and current row is empty or has 1 vertical image
        if h_idx < len(horizontal_images) and (len(current_row) == 0 or (len(current_row) == 1 and current_row[0]['type'] == 'vertical')):
            all_images.append(horizontal_images[h_idx])
            h_idx += 1
        # Otherwise add vertical images
        elif v_idx < len(vertical_images):
            all_images.append(vertical_images[v_idx])
            v_idx += 1
        # If no more vertical images, add remaining horizontal
        elif h_idx < len(horizontal_images):
            all_images.append(horizontal_images[h_idx])
            h_idx += 1
    
    # Now create the layout
    for img in all_images:
        if img['type'] == 'horizontal':
            # Horizontal image needs 2 columns
            if current_row_width + 2 > max_row_width and current_row:
                # Start new row
                layout.append(current_row)
                current_row = []
                current_row_width = 0
            
            current_row.append(img)
            current_row_width += 2
            
        else:  # vertical
            # Vertical image needs 1 column
            if current_row_width + 1 > max_row_width and current_row:
                # Start new row
                layout.append(current_row)
                current_row = []
                current_row_width = 0
            
            current_row.append(img)
            current_row_width += 1
            
            # If this makes the row full, start new row
            if current_row_width == max_row_width:
                layout.append(current_row)
                current_row = []
                current_row_width = 0
    
    # Add remaining images
    if current_row:
        layout.append(current_row)
    
    # Ensure no row has only one image (except last row if odd)
    final_layout = []
    for i, row in enumerate(layout):
        if len(row) == 1 and i < len(layout) - 1:
            # Move this image to next row
            if i + 1 < len(layout):
                layout[i + 1].insert(0, row[0])
            else:
                # This is the last row, it's okay to have one image
                final_layout.append(row)
        else:
            final_layout.append(row)
    
    return final_layout

if __name__ == "__main__":
    # Set seed for reproducible randomization
    random.seed(42)
    
    html = generate_random_gallery()
    print(html)
