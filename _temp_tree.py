import os

startpath = '.'
ignore = {'node_modules', '.git', '__pycache__', 'venv', 'env', 'dist', 'build', '.idea', '.vscode', 'coverage', '.checker_cache'}

with open('structure.txt', 'w', encoding='utf-8') as f:
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in ignore]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        f.write('{}{}/\n'.format(indent, os.path.basename(root)))
        subindent = ' ' * 4 * (level + 1)
        for file in files:
            f.write('{}{}\n'.format(subindent, file))
