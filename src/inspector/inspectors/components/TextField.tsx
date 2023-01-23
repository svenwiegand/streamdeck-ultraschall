import {Item} from "./Item"
import * as React from "react"

export interface Props {
    label?: string
    value?: string | number
    onChange?: (value: string) => void
    pattern?: string
    required?: boolean
}

export const TextField: React.FC<Props> = (props: Props) => {
    const {label, onChange, ...inputProps} = props
    const nativeOnChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement>) => onChange?.(event.currentTarget.value),
        [onChange]
    )
    return (
        <Item label={label}>
            <input
                className="sdpi-item-value"
                type="text"
                onChange={nativeOnChange}
                {...inputProps}
            />
        </Item>
    )
}