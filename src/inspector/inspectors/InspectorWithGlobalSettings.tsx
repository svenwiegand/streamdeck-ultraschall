import * as React from "react"
import {GlobalSettings, globalSettingsDefault} from "common/actions/global"
import {ActionInspector} from "streamdeck/inspector/ActionInspector"
import {TextField} from "./components/TextField"
import {HelperText} from "./components/HelperText"
import {Item} from "./components/Item"

type Props = {
    inspector: ActionInspector<object, GlobalSettings>
    children?: React.ReactNode
}

export const InspectorWithGlobalSettings: React.FC<Props> = ({inspector, children}) => {
    const [hostIp, setHostIp] = React.useState<string | undefined>()
    const [sendPort, setSendPort] = React.useState<number | undefined>()
    const [receivePort, setReceivePort] = React.useState<number | undefined>()
    React.useEffect(() => {
        const fetchGlobalSettings = async () => {
            const settings = {...globalSettingsDefault, ...await inspector.getGlobalSettings()}
            setHostIp(settings.hostIp)
            setSendPort(settings.sendPort)
            setReceivePort(settings.receivePort)
        }
        fetchGlobalSettings()
    }, [])

    const setNumberFromString = (setter: (n: number) => void) => (
        (value: string) => {
            const n = parseInt(value)
            if (!isNaN(n)) {
                setter(n)
            }
        }
    )
    const applySettings = () => {
        if (hostIp && sendPort && receivePort)
        inspector.setGlobalSettings({hostIp, sendPort, receivePort})
    }
    const inputs = hostIp && sendPort && receivePort ? (<>
        <TextField
            label="Send IP"
            value={hostIp}
            onChange={setHostIp}
            required
            pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
        />
        <TextField
            label="Send Port"
            value={sendPort}
            onChange={setNumberFromString(setSendPort)}
            required
            pattern="\d{1,5}"
        />
        <TextField
            label="Receive Port"
            value={receivePort}
            onChange={setNumberFromString(setReceivePort)}
            required
            pattern="\d{1,5}"
        />
        <HelperText>
            <a href="https://github.com/svenwiegand/streamdeck-ultraschall/blob/main/SETUP.md" target="_blank">
                See documentation for details
            </a>
        </HelperText>
        <Item>
            <button className="sdpi-item-value" onClick={applySettings}>Save</button>
        </Item>
    </>) : <></>
    return (<>
        {children}
        <hr/>
        <details className="pointer">
            <summary>Global Settings</summary>
            {inputs}
        </details>
    </>)
}