import re

filepath = r'D:\KERJAAN PUSBIKES\Pelatihan Koding\UR Sardjito\src\App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

if 'import logo from' not in content:
    content = content.replace('import React, ', 'import logo from "./assets/logo.png";\nimport React, ', 1)

content = content.replace('"https://lh3.googleusercontent.com/d/1K9BUgDDRmF0d9Q9mCasC5KhDXVpVhJs5"', '{logo}')
content = content.replace('akurat.id Analytics Platform', 'UR Sardjito Analytics Platform')
content = content.replace('Akurat.id Analytics Platform', 'UR Sardjito Analytics Platform')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated App.jsx')
