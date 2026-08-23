import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
bat = root / 'start-real-estate.bat'

if not bat.exists():
    sys.exit(1)

subprocess.Popen([str(bat)], cwd=str(root), shell=True)
