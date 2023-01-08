import * as React from "react"
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

    const setNumberFromString = (setter: (n: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseInt(event.currentTarget.value)
        if (!isNaN(n)) {
            setter(n)
        }
    }
    const applySettings = () => {
        if (hostIp && sendPort && receivePort)
        inspector.setGlobalSettings({hostIp, sendPort, receivePort})
    }
    const inputs = hostIp && sendPort && receivePort ? (<>
        <div className="sdpi-item">
            <div className="sdpi-item-label">Send IP</div>
            <input
                type="text"
                value={hostIp}
                onChange={e => setHostIp(e.currentTarget.value)}
                className="sdpi-item-value"
                required
                pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
            />
        </div>
        <div className="sdpi-item">
            <div className="sdpi-item-label">Send Port</div>
            <input
                type="text"
                value={sendPort}
                onChange={setNumberFromString(setSendPort)}
                className="sdpi-item-value"
                required
                pattern="\d{1,5}"
            />
        </div>
        <div className="sdpi-item">
            <div className="sdpi-item-label">Receive Port</div>
            <input
                type="text"
                value={receivePort}
                onChange={setNumberFromString(setReceivePort)}
                className="sdpi-item-value"
                required
                pattern="\d{1,5}"
            />
        </div>
        <div className="sdpi-item">
            <div className="sdpi-item-label empty"></div>
            <a className="sdpi-item-value" href="https://github.com/svenwiegand/streamdeck-ultraschall/blob/main/SETUP.md" target="_blank">
                See documentation for details
            </a>
        </div>
        <div className="sdpi-item">
            <div className="sdpi-item-label empty"></div>
            <button className="sdpi-item-value" onClick={applySettings}>Save</button>
        </div>
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