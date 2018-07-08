import sys
import yaml


CONFIG_FILE = "./config/config.yaml"

if len(sys.argv) > 1:
	CONFIG_FILE = "./config/{}".format(sys.argv[1])

with open(CONFIG_FILE) as w:
    CONFIG = yaml.load(w.read())
