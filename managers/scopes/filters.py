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
    clause = []
    print(type(plist), plist, 11)
    for pattern in plist:
        print(122, pattern)
        if pattern:
            if isinstance(column.type, Integer):
                if pattern.startswith('!'):
                    clause.append(column != int(pattern))
                else:
                    if pattern == '%':
                        clause.append(column > 0)
                    else:
                        clause.append(column == int(pattern))
                        print(111, clause)
            else:
                if pattern.startswith('!'):
                    pattern = pattern[1:]
                    if '%' in pattern:
                        clause.append(~column.like(pattern.replace('*', '%')))
                    else:
                        clause.append(column != pattern)
                else:
                    if '%' in pattern:
                        clause.append(column.like(pattern.replace('*', '%')))
                    else:
                        clause.append(column == pattern)

    return clause


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
                    parsed_filters['ips'] = get_filter_clause(
                        IPDatabase.target, each_filter_value
                    )
                elif key == 'host':
                    parsed_filters['hosts'] = get_filter_clause(
                        HostDatabase.target, each_filter_value
                    )
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

        if filters_exist:
            scans_filters += get_filter_clause(
                alias.port_number, parsed_filters['ports']
            )
            scans_filters += get_filter_clause(
                alias.protocol, parsed_filters['protocols']
            )
            scans_filters += get_filter_clause(
                alias.banner, parsed_filters['banners']
            )

        return scans_filters

    @staticmethod
    def build_files_filters(parsed_filters, alias):
        filters_exist = len(parsed_filters['files']) != 0
        files_filters = []

        # If there are no filters, return
        if filters_exist:
            files_filters += get_filter_clause(
                alias.status_code, parsed_filters['files']
            )

        return files_filters
