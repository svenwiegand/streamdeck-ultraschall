import * as React from "react"

export interface Props {
    children?: React.ReactNode
}

export const Heading: React.FC<Props> = (props: Props) => {
    return (
        <div className="sdpi-heading">
            <strong>{props.children}</strong>
        </div>
    )
}