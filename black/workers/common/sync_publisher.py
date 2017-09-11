import pika
from threading import Lock


class SyncPublisher(object):

    def __init__(self, routing_key):
        self.EXCHANGE = "tasks.exchange"
        self.EXCHANGE_TYPE = "direct"
        self.ROUTING_KEY = routing_key
        self.QUEUE_NAME = routing_key
        self._connection = None
        self._channel = None
        self.lock = Lock()

        credentials = pika.PlainCredentials('guest', 'guest')
        self._parameters = pika.ConnectionParameters(
            host='localhost',
            port=5672,
            virtual_host='/',
            credentials=credentials,
            heartbeat_interval=0
        )

    def connect(self):
        self._connection = pika.BlockingConnection(self._parameters)
        self._channel = self._connection.channel()
        self._channel.queue_declare(
            queue=self.QUEUE_NAME, durable=True
        )  # Declare a queue

    def send(self, message):
        self.lock.acquire()
        self._channel.basic_publish(self.EXCHANGE, self.ROUTING_KEY, message)
        self.lock.release()

    def close(self):
        self._connection.close()
