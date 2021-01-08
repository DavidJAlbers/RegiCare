import React from 'react'

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

interface CopyableCommandProps {
    command: string
}

export default function CopyableCommand({command}: CopyableCommandProps) {
    const popover = (
        <Popover id="">
            <Popover.Content>
                Copied to clipboard!
            </Popover.Content>
        </Popover>
    )
    return (
        <OverlayTrigger trigger="click" rootClose placement="top" overlay={popover}>
            <kbd style={{cursor: "pointer"}} onClick={() => navigator.clipboard.writeText(command)}>
                {command}
            </kbd>
        </OverlayTrigger>
    )
}
