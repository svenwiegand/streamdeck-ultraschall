import * as React from "react"
import {SDTextInput} from "react-streamdeck"
import {GlobalSettings, globalSettingsDefault} from "../../common/actions/global"
import {StreamdeckClient} from "../../streamdeck/common/StreamdeckClient"
import {SendEvent} from "../../streamdeck/inspector/events"

type Props = {
    client: StreamdeckClient<SendEvent<object, GlobalSettings>, GlobalSettings>
    children?: React.ReactNode
}

export const InspectorWithGlobalSettings: React.FC<Props> = ({client, children}) => {
    const [hostIp, setHostIp] = React.useState<string | undefined>()
    const [sendPort, setSendPort] = React.useState<number | undefined>()
    const [receivePort, setReceivePort] = React.useState<number | undefined>()
    React.useEffect(() => {
        const fetchGlobalSettings = async () => {
            const settings = {...globalSettingsDefault, ...await client.getGlobalSettings()}
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
        client.sendEvent({
            event: "setGlobalSettings",
            context: client.uuid,
            payload: {hostIp, sendPort, receivePort}
        })
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