""" Keeps some APIs for doing dirsearch requests """
from urllib.parse import urlparse, urljoin
import aiohttp


class Requester(object):
    """ Really stupid class that makes requests to the target
    and returns the answer """

    headers = {
        'User-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36',
        'Accept-Language': 'en-us',
        'Accept-Encoding': 'identity',
        'Keep-Alive': '300',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
    }

    def __init__(self, url, cookies=None, headers=None):
        if not url.endswith('/'):
            url = url + '/'

        self.base_url = url

        # Let's parse your basic url
        parsed = urlparse(url)

        # Base path to the searched files
        self.base_path = parsed.path

        # URL scheme
        if parsed.scheme == 'https':
            self.protocol = 'https'
        else:
            self.protocol = 'http'

        # Host of the URL
        self.host = parsed.netloc.split(':')[0]

        # # Resolve DNS to decrease overhead
        # if ip_address is not None:
        #     self.ip_address = ip_address
        # else:
        #     try:
        #         self.ip_address = socket.gethostbyname(self.host)
        #     except socket.gaierror:
        #         raise Exception({'message': "Couldn't resolve DNS"})
        # self.headers['Host'] = self.host

        # If no port specified, set default (80, 443)
        try:
            self.port = parsed.netloc.split(':')[1]
        except IndexError:
            self.port = (443 if self.protocol == 'https' else 80)

        self.cookies = cookies

        if headers is not None:
            self.headers += headers

        self.session = aiohttp.ClientSession(cookies=self.cookies,
                                             headers=self.headers)

    async def perform_request(self, file_path):
        """ Plain request to the url """
        url = urljoin(self.base_url, file_path)
        resp = await self.session.get(url)

        print(url, resp)

        status_code = resp.status
        length = resp.content_length or len(await resp.text())

        resp.close()

        return (status_code, length, url, self.host, self.port)

    def destructor(self):
        """ Wrapper for killing aiohttp session"""
        self.session.close()
