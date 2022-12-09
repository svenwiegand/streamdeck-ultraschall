import * as React from "react"
import { SDTextInput } from "react-streamdeck"

interface Props {
    name?: string
    onNameChange: (name: string) => void
}

export const propertyInspector: React.FC<Props> = (props: Props) => {
    const [name, setName] = React.useState(props.name ?? "Sven")
    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
        props.onNameChange?.(e.currentTarget.value)
    }
    return (
        <>
            <SDTextInput value={name} label={"Your name"} onChange={onNameChange} />
            <div>Hello {name}!</div>
        </>
    )
}
