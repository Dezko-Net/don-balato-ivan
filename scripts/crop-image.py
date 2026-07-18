from PIL import Image
import sys
import os

def crop_bottom_10(input_path, output_path=None):
    if output_path is None:
        name, ext = os.path.splitext(input_path)
        output_path = f"{name}_cropped{ext}"
    
    img = Image.open(input_path)
    width, height = img.size
    
    crop_bottom = int(height * 0.20)
    crop_side = int(width * 0.05)
    crop_top = int(height * 0.05)
    
    new_left = crop_side
    new_top = crop_top
    new_right = width - crop_side
    new_bottom = height - crop_bottom
    
    cropped = img.crop((new_left, new_top, new_right, new_bottom))
    cropped.save(output_path)
    
    print(f"Original: {width}x{height}")
    print(f"Recortada: {new_right - new_left}x{new_bottom - new_top} (lados 5%, arriba 5%, abajo 20%)")
    print(f"Guardada en: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python crop-image.py <imagen> [output]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    crop_bottom_10(input_path, output_path)
