from time import sleep

def hello_task(who="world"):
    sleep(0.5)
    print("Hello %s" % (who, ))