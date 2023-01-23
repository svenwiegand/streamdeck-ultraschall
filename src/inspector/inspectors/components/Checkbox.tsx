import {Item} from "./Item"
import * as React from "react"

export interface Props {
    label?: string
    checkboxLabel: string
    checked?: boolean
    onChange?: (checked: boolean) => void
}

export const Checkbox: React.FC<Props> = (props: Props) => {
    const {label, checkboxLabel, checked, onChange } = props
    const nativeOnChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement>) => onChange?.(event.currentTarget.checked),
        [onChange]
    )
    const id = checkboxLabel.replace(" ", "_")
    return (
        <Item label={label} type="checkbox">
            <input
                id={id}
                className="sdpi-item-value select"
                type="checkbox"
                checked={checked}
                onChange={nativeOnChange}
            />
            <label {...{for: id}}><span/>{checkboxLabel}</label>
        </Item>
    )
}