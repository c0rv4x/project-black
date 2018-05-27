import yaml


with open('./config/config.yaml') as w:
    CONFIG = yaml.load(w.read())
