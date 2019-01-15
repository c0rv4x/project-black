import _ from 'lodash'
import React from 'react'

import {
	Box
} from 'grommet'


const files = {
    200: { color: "status-ok" },
    301: { color: "dark-1" },
    302: { color: "dark-1" },
    401: { color: "status-warning" },
}

function generateFiles(stats, target_id) {
    let boxes = [];

    _.forOwn(stats, (amount, code) => {
        if (Object.keys(files).indexOf(code) !== -1) {
            boxes.push(
                <Box
                    key={target_id + "-" + code}
                    border={{size: "small", color: files[code]['color']}}
                    pad="xxsmall"
                    round="xsmall"
                    margin={{
                        right: "xsmall"
                    }}
                >
                    {amount}x {code}
                </Box>                
            );
        }
    });
    return boxes;
}

export default generateFiles;