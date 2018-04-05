from sqlalchemy import Integer, or_, and_

from black.black.db import (
    HostDatabase, IPDatabase, ScanDatabase, FileDatabase
)


def get_filter_clause(column, plist):
    '''Return a filter clause under given table column

    Keyword arguments:
    column -- sql tables' column filter is applied to
    plist -- list of patterns, like ['*foo*', '!*foo1*']
    '''
    positive_clause = []
    negative_clause = []

    for pattern in plist:
        if pattern:
            if isinstance(column.type, Integer):
                if pattern.startswith('!'):
                    pattern = pattern[1:]
                    negative_clause.append(column != int(pattern))
                else:
                    if pattern == '%':
                        positive_clause.append(column > 0)
                    else:
                        positive_clause.append(column == int(pattern))
            else:
                if pattern.startswith('!'):
                    pattern = pattern[1:]
                    if '%' in pattern:
                        negative_clause.append(~column.like(pattern.replace('*', '%')))
                    else:
                        negative_clause.append(column != pattern)
                else:
                    if '%' in pattern:
                        positive_clause.append(column.like(pattern.replace('*', '%')))
                    else:
                        positive_clause.append(column == pattern)

    return and_(and_(*negative_clause), or_(*positive_clause))


class Filters(object):

    @staticmethod
    def parse_filters(filters):
        parsed_filters = {
            'ips': True,
            'hosts': True,
            'ports': True,
            'banners': True,
            'protocols': True,
            'files': True
        }

        for key in filters.keys():
            filter_value = filters[key]

            if key == 'ip':
                parsed_filters['ips'] = get_filter_clause(
                    IPDatabase.target, filter_value
                )
            elif key == 'host':
                parsed_filters['hosts'] = get_filter_clause(
                    HostDatabase.target, filter_value
                )
            # elif key == 'port':
            #     parsed_filters['ports'] = get_filter_clause(
            #         ScanDatabase.port_number, filter_value
            #     )
            # elif key == 'banner':
            #     parsed_filters['banners'] = get_filter_clause(
            #         ScanDatabase.banner, filter_value
            #     )
            # elif key == 'protocol':
            #     parsed_filters['protocols'] = get_filter_clause(
            #         ScanDatabase.protocol, filter_value
            #     )
            # elif key == 'files':
            #     parsed_filters['files'] += get_filter_clause(
            #         FileDatabase.status_code, filter_value
            #     )

        return parsed_filters

    @staticmethod
    def build_scans_filters(filters, alias):
        parsed_filters = {}

        ports = filters.get('ports', [])
        protocols = filters.get('protocols', [])
        banners = filters.get('banners', [])

        print(ports)

        parsed_filters['ports'] = get_filter_clause(alias.port_number, ports)
        parsed_filters['protocols'] = get_filter_clause(alias.protocol, protocols)
        parsed_filters['banners'] = get_filter_clause(alias.banner, banners)
    
        filters_exist = (
            ports or
            protocols or
            banners
        )

        scans_clause = True

        if filters_exist:
            scans_clause = and_(
                parsed_filters['ports'],
                parsed_filters['protocols'],
                parsed_filters['banners']
            )

        return scans_clause

    @staticmethod
    def build_files_filters(filters, alias):
        files_filters = True        

        # If there are no filters, return
        if filters.get('files', None):
            files_filters = get_filter_clause(alias.status_code, filters.get('files', []))

        return files_filters
