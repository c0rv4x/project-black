import asyncio
import aiodns


async def get_nameservers(hosts, logger=None):
    nameservers = []
    top_domains = []

    for hostname in hosts:
        top_domains.append('.'.join(hostname.split('.')[-2:]))

    for top_server_name in list(set(top_domains)):
        resolver = aiodns.DNSResolver(loop=asyncio.get_event_loop())
        result = await resolver.query(top_server_name, "NS")
        nameservers += list(map(lambda x: x.host, result))

    if logger:
        logger.debug(
            "Scopes resolve, found NSes: {}".format(
                nameservers
            )
        )

    futures = []
    for ns in nameservers:
        each_future = resolver.query(ns, "A")
        futures.append(each_future)

    (done_futures, _) = await asyncio.wait(
        futures, return_when=asyncio.ALL_COMPLETED
    )

    nameservers_ips = ['8.8.8.8']

    while done_futures:
        each_future = done_futures.pop()

        try:
            result = each_future.result()
            nameservers_ips += list(map(lambda x: x.host, result))
        except:
            pass

    if logger:
        logger.debug(
            "Scopes resolve, resolved NSes: {}".format(
                nameservers_ips
            )
        )

    return list(set(nameservers_ips))