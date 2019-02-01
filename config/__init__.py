import sys
import yaml


CONFIG_FILE = "./config/config.yaml"

for cmdline_entry in sys.argv:
    if cmdline_entry.endswith("yml"):
        CONFIG_FILE = cmdline_entry

with open(CONFIG_FILE) as w:
    CONFIG = yaml.load(w.read())
