import * as React from "react"
import {SDTextInput} from "react-streamdeck"
import {GlobalSettings, globalSettingsDefault} from "common/actions/global"
import {ActionInspector} from "streamdeck/inspector/ActionInspector"

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

    const setNumberFromString = (setter: (n: number) => void) =>
        (event: React.ChangeEvent<HTMLInputElement>) => setter(Number(event.currentTarget.value))
    const applySettings = () => {
        if (hostIp && sendPort && receivePort)
        inspector.setGlobalSettings({hostIp, sendPort, receivePort})
    }
    const inputs = hostIp && sendPort && receivePort ? (<>
        <SDTextInput value={hostIp} label="Host IP" onChange={e => setHostIp(e.currentTarget.value)}/>
        <SDTextInput value={sendPort.toString()} label="Send Port" onChange={setNumberFromString(setSendPort)}/>
        <SDTextInput value={receivePort.toString()} label="Receive Port" onChange={setNumberFromString(setReceivePort)}/>
        <div className="sdpi-item">
            <button className="sdpi-item-value" onClick={applySettings}>Save</button>
        </div>
    </>) : <></>
    return (<>
        {children}
        <details>
            <summary>Global Settings</summary>
            {inputs}
        </details>
    </>)
}