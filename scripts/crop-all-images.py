from PIL import Image
import os

input_dir = os.path.join(os.getcwd(), "excels", "imagenes-descargadas")
output_dir = os.path.join(os.getcwd(), "excels", "imagenes-cortadas")

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

count = 0
failed = 0

for filename in os.listdir(input_dir):
    if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp')):
        continue
    
    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)
    
    try:
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
        count += 1
        
        if count % 20 == 0:
            print(f"Procesadas: {count}")
    except Exception as e:
        print(f"Error con {filename}: {e}")
        failed += 1

print(f"\nTotal: {count} procesadas, {failed} errores")
print(f"Guardadas en: {output_dir}")
