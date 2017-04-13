""" Keeps some APIs for doing dirsearch requests """
import aiohttp


class Requester(object):
    """ Really stupid class that makes requests to the target
    and returns the answer """
    def __init__(self, cookies=None, headers=None):
        self.cookies = cookies
        self.headers = headers
        self.session = aiohttp.ClientSession(cookies=self.cookies,
                                             headers=self.headers)

    async def perform_request(self, url):
        """ Plain request to the url """
        resp = await self.session.get(url)
        print(url, resp)
        status_code = resp.status
        length = resp.content_length or len(await resp.text())

        resp.close()
        return (status_code, length)

    def destructor(self):
        """ Wrapper for killing aiohttp session"""
        self.session.close()
