import sys
import yaml


CONFIG_FILE = "./config/config.yaml"

for entry in sys.argv:
    if entry.startswith('config'):
        CONFIG_FILE = entry

with open(CONFIG_FILE) as w:
    CONFIG = yaml.load(w.read())
