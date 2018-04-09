""" Logging functionality along with logger formattin """
import os
import logging
import inspect
import datetime


DEFAULT_FORMAT = '%(asctime)s %(process)d %(levelname)s ' + \
                 '[%(name)s:%(funcName)s:%(lineno)d] %(message)s'

LOGS_DIR = './logs'


def init_default(default_format=DEFAULT_FORMAT, level=logging.DEBUG):
    if not os.path.exists(LOGS_DIR):
        os.makedirs(LOGS_DIR)

    filename = datetime.datetime.now().strftime('%Y-%m-%d_%H:%M')
    logging.basicConfig(filename=os.path.join(LOGS_DIR, filename + '.log'), format=default_format, level=logging.DEBUG)

    console = logging.StreamHandler()
    console.setLevel(logging.WARNING)

    logging.getLogger('').addHandler(console)


def log(cls):
    """Insert logger into class or create standalone logger from string."""
    if inspect.isclass(cls):
        cls.logger =  logging.getLogger(get_logger_name(cls))
        return cls
    elif type(cls) is str:
        return logging.getLogger(cls)
    else:
        raise ValueError('Expected class or string in parameter cls')


def get_logger_name(cls):
    """Return logger name."""
    module_name = inspect.getmodule(cls)
    if module_name:
        module_name = module_name.__name__
    else:
        module_name = ''
    class_name = cls.__name__
    return '{}.{}'.format(module_name, class_name)
