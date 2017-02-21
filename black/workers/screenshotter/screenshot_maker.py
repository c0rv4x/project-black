""" Do a screenshot """
import sys
import traceback
import requests

from selenium import webdriver

def simple_get(url, timeout=10, proxy=None):
    session = requests.session()
    if proxy is not None:
        session.proxies = {
            'http': 'socks5://' + proxy, 'https': 'socks5://' + proxy}
    resp = session.get(url, allow_redirects=False)

    return resp


def make_screenshot(url, screenshot_name, proxy=None, timeout=10):
    def make_auth_screenshot(resp):
        print(url + " Requires HTTP Basic Auth")
        f = open(screenshot_name + ".html", 'w')
        f.write(resp.headers.get('www-authenticate', 'NONE'))
        f.write('<title>Basic Auth</title>')
        f.close()
        writeImage(resp.headers.get(
            'www-authenticate', 'NO WWW-AUTHENTICATE HEADER'), screenshot_name + ".png")

    debug = True
    try:
        browser = None
        if proxy is not None:
            service_args = ['--ignore-ssl-errors=true',
                            '--ssl-protocol=any', '--proxy=' + proxy, '--proxy-type=socks5']
        else:
            service_args = ['--ignore-ssl-errors=true', '--ssl-protocol=any']

        browser = webdriver.PhantomJS(
            service_args=service_args, executable_path="phantomjs")
        browser.set_window_size(1024, 768)

    except:
        print("[-] Oh no! Couldn't create the browser, Selenium blew up")
        exc_type, exc_value, exc_traceback = sys.exc_info()
        lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        # TODO: add logger here
        print(''.join('!! ' + line for line in lines))
        browser.quit()

        return {"success": None, "error": True}

    basic_response = simple_get(url, timeout=timeout, proxy=proxy)

    if basic_response is not None and basic_response.status_code == 401:
        make_auth_screenshot(basic_response)
    else:
        browser.set_page_load_timeout((timeout))
        old_url = browser.current_url
        browser.get(url.strip())
        if browser.current_url == old_url:
            print(
                "[-] Error fetching in browser but successfully fetched with Requests: " + url)
            if headless:
                browser2 = None
                if debug:
                    print(
                        "[+] Trying with sslv3 instead of TLS - known phantomjs bug: " + url)
                if proxy is not None:
                    browser2 = webdriver.PhantomJS(service_args=[
                        '--ignore-ssl-errors=true',
                        '--proxy=' + proxy,
                        '--proxy-type=socks5'],
                                                   executable_path="phantomjs")
                else:
                    browser2 = webdriver.PhantomJS(
                        service_args=['--ignore-ssl-errors=true'], executable_path="phantomjs")

                old_url = browser2.current_url
                try:
                    browser2.get(url.strip())
                    if browser2.current_url == old_url:
                        if debug:
                            print("[-] Didn't work with SSLv3 either..." + url)
                        # TODO: add logger here
                        browser2.quit()

                        return {"success": None, "error": True}
                    else:
                        print('[+] Saving: ' + screenshot_name)
                        html_source = browser2.page_source
                        f = open(screenshot_name + ".html", 'w')
                        f.write(html_source)
                        f.close()
                        browser2.save_screenshot(screenshot_name + ".png")
                        browser2.quit()
                except:
                    browser2.quit()
                    # TODO: add logger here
                    print("[-] Didn't work with SSLv3 either - exception..." + url)

                    return {"success": None, "error": True}

        else:
            print('[+] Saving: ' + screenshot_name)
            html_source = browser.page_source
            f = open(screenshot_name + ".html", 'w')
            f.write(html_source)
            f.close()
            browser.save_screenshot(screenshot_name + ".png")

            return {"success": True, "error": None}
