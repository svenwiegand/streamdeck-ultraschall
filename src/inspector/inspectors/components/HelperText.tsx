import {Item} from "./Item"
import * as React from "react"

export interface Props {
    children?: React.ReactNode
}

export const HelperText: React.FC<Props> = (props: Props) => {
    return (
        <Item>
            <details className="sdpi-item-value">
                <summary>{props.children}</summary>
            </details>
        </Item>
    )
}