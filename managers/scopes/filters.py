from sqlalchemy import or_, and_


class Filters(object):

    @staticmethod
    def parse_filters(filters):
        parsed_filters = {
            'ips': [],
            'hosts': [],
            'ports': [],
            'banners': [],
            'protocols': [],
            'files': []
        }

        for key in filters.keys():
            filter_value = filters[key]
            for each_filter_value in filter_value:
                if key == 'ip':
                    if '%' in each_filter_value:
                        parsed_filters['ips'].append(
                            IPDatabase.target.like(each_filter_value))
                    else:
                        parsed_filters['ips'].append(
                            IPDatabase.target == each_filter_value)
                elif key == 'host':
                    if '%' in each_filter_value:
                        parsed_filters['hosts'].append(
                            HostDatabase.target.like(each_filter_value))
                    else:
                        parsed_filters['hosts'].append(
                            HostDatabase.target == each_filter_value)
                elif key == 'port':
                    parsed_filters['ports'].append(each_filter_value)
                elif key == 'banner':
                    parsed_filters['banners'].append(each_filter_value)
                elif key == 'protocol':
                    parsed_filters['protocols'].append(each_filter_value)
                elif key == 'files':
                    parsed_filters['files'].append(each_filter_value)

        return parsed_filters

    @staticmethod
    def build_scans_filters(parsed_filters, alias):
        filters_exist = (
            parsed_filters['ports'] or
            parsed_filters['protocols'] or
            parsed_filters['banners']
        )
        scans_filters = []

        negative_filter_found = False

        # If there are no filters, return
        if filters_exist:
            ports_filters_list = []
            for port_number in parsed_filters['ports']:
                if port_number == '%':
                    ports_filters_list.append(alias.port_number > 0)
                else:
                    if port_number[0] == '!':
                        negative_filter_found = True
                        ports_filters_list.append(
                            alias.port_number != port_number[1:])
                    else:
                        ports_filters_list.append(
                            alias.port_number == port_number)

            protocols_filters_list = []
            for protocol in parsed_filters['protocols']:
                if '%' in protocol:
                    protocols_filters_list.append(
                        alias.protocol.ilike(protocol))
                else:
                    protocols_filters_list.append(
                        alias.protocol == protocol)

            banners_filters_list = []
            for banner in parsed_filters['banners']:
                if '%' in banner:
                    banners_filters_list.append(
                        alias.banner.ilike(banner))
                else:
                    banners_filters_list.append(
                        alias.banner == banner)

            if negative_filter_found:
                scans_filters = [
                    and_(*ports_filters_list),
                    or_(*protocols_filters_list),
                    or_(*banners_filters_list)
                ]
            else:
                scans_filters = [
                    or_(*ports_filters_list),
                    or_(*protocols_filters_list),
                    or_(*banners_filters_list)
                ]

        return scans_filters

    @staticmethod
    def build_files_filters(parsed_filters, alias):
        filters_exist = parsed_filters['files']
        files_filters = []

        # If there are no filters, return
        if filters_exist:
            status_code_filters = []
            for status_code in parsed_filters['files']:
                if status_code == '%':
                    status_code_filters.append(
                        alias.status_code > 0)
                else:
                    status_code_filters.append(
                        alias.status_code == status_code)

            status_code_filter = or_(*status_code_filters)

            files_filters = [status_code_filter]

        return files_filters
