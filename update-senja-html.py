#!/usr/bin/env python3

# Script to update the Senja gallery HTML with optimized images

def update_html():
    html_file = "/home/albin/git/nordtrip/resor/tidigare-resor/index.html"
    gallery_html_file = "/tmp/senja-gallery.html"
    
    # Read the current HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Read the new gallery HTML
    with open(gallery_html_file, 'r', encoding='utf-8') as f:
        new_gallery = f.read()
    
    # Find and replace the gallery content between the gallery-grid div
    start_marker = '<div class="gallery-grid">'
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Error: Could not find gallery-grid start marker")
        return
    
    # Find the end of the opening tag
    start_idx = content.find('>', start_idx) + 1
    
    # Find the end marker
    end_search_start = start_idx + 1000
    end_idx = content.find('                  </div>\n                </div>', end_search_start)
    
    if end_idx == -1:
        print("Error: Could not find gallery-grid end marker")
        return
    
    # Construct the new content
    new_content = content[:start_idx] + '\n' + new_gallery + '\n                  ' + content[end_idx:]
    
    # Write the updated HTML file
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Updated {html_file}")
    print(f"  Gallery with auto-layout (25 images)")
    print(f"  - Category 1: 22 images (vertical)")
    print(f"  - Category 2: 4 images (horizontal)")
    print(f"  - Category 3: 4 images (large/featured)")
    print(f"  - Image 14: rotated 90° left")
    print(f"  - JavaScript will handle layout automatically")

if __name__ == "__main__":
    update_html()

