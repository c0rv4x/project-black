import _ from 'lodash'
import React from 'react'

import {
    Box,
    Text
} from 'grommet'


const files = {
    200: { color: "status-ok" },
    301: { color: "dark-1" },
    302: { color: "dark-1" },
    401: { color: "status-warning" }
}

function generateFiles(stats, target_id, port_number) {
    let boxes = [];

    _.forOwn(stats, (amount, code) => {
        if (Object.keys(files).indexOf(code) !== -1) {
            boxes.push(
                <Box
                    key={target_id + ":" + port_number + "-" + code}
                    border={{size: "small", color: files[code]['color']}}
                    pad="xxsmall"
                    round="xsmall"
                    margin={{
                        right: "xsmall"
                    }}
                >
                    <Text size="small">{amount}x {code}</Text>
                </Box>                
            );
        }
    });
    boxes.push(
        <Box
            key={target_id + ":" + port_number + "-total"}
            border={{size: "small", color: "dark-3"}}
            pad="xxsmall"
            round="xsmall"
            margin={{
                right: "xsmall"
            }}
        >
            <Text size="small">{stats['total']}x total</Text>
        </Box>                
    );
    return boxes;
}

export default generateFiles;