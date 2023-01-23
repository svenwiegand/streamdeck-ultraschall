import {Item} from "./Item"
import * as React from "react"

export interface Props<Value extends (number | string)> {
    label?: string
    value?: Value
    onChange?: (value: Value) => void
    options: [Value, string][]
}

export function Select<Value extends (number | string)>(props: Props<Value>) {
    const {label, value, onChange, options } = props
    const nativeOnChange = React.useCallback(
        (event: React.FormEvent<HTMLSelectElement>) => onChange?.(event.currentTarget.value as Value),
        [onChange]
    )
    return (
        <Item label={label}>
            <select
                className="sdpi-item-value select"
                value={value}
                onChange={nativeOnChange}
            >
                {options.map(option => (
                    <option value={option[0]}>{option[1]}</option>
                ))}
            </select>
        </Item>
    )
}