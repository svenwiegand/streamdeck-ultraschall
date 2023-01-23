import * as React from "react"

export interface Props {
    type?: "checkbox"
    label?: string
    children?: React.ReactNode
}

export const Item: React.FC<Props> = (props: Props) => {
    const labelClass = `sdpi-item-label ${props.label?.length ? "" : "empty"}`
    return (
        <div className="sdpi-item" {...{type: props.type}}>
            <div className={labelClass}>{props.label}</div>
            {props.children}
        </div>
    )
}