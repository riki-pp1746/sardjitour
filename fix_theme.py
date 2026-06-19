import os, re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace Tailwind teal classes with blue
        new_content = re.sub(r'\bteal-', 'blue-', content)
        
        # Replace teal hex colors with blue equivalents
        # teal-500 #14b8a6 -> blue-500 #3b82f6
        new_content = new_content.replace('#14b8a6', '#3b82f6')
        new_content = new_content.replace('rgba(20,184,166', 'rgba(59,130,246')
        
        # teal-600 #0d9488 -> blue-600 #2563eb
        new_content = new_content.replace('#0d9488', '#2563eb')
        
        # teal-700 #0f766e -> blue-700 #1d4ed8
        new_content = new_content.replace('#0f766e', '#1d4ed8')
        
        # teal-900 #042f2e -> blue-900 #1e3a8a
        new_content = new_content.replace('#042f2e', '#1e3a8a')

        # Also replace "corporate" references if any exist
        new_content = new_content.replace('tema corporate', 'tema biru')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filepath}')
    except Exception as e:
        pass

for root, dirs, files in os.walk(r'D:\KERJAAN PUSBIKES\Pelatihan Koding\UR Sardjito'):
    if 'node_modules' in root or '.git' in root or 'dist' in root:
        continue
    for file in files:
        if file.endswith(('.js', '.jsx', '.html', '.css', '.md')):
            replace_in_file(os.path.join(root, file))
print('Done')
