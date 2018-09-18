import sys
import yaml


CONFIG_FILE = "./config/config.yaml"

if len(sys.argv) > 1:
        if sys.argv[1] == "docker":
                CONFIG_FILE = "./config/config_docker.yaml"
        elif sys.argv[1] == "custom":
                CONFIG_FILE = "./config/custom.yaml"

with open(CONFIG_FILE) as w:
    CONFIG = yaml.load(w.read())
