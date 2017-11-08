from black.black.db import IP_addr
from managers.scopes.ip import IP


class IP_wrapper(IP_addr, IP):

	def __init__(self):
		print("Called IP_wrapper constructor")
