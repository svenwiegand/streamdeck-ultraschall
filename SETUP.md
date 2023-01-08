# Setup OSC Connection
This Stream Deck plugin talks to Reaper using OSC based on UDP. Thus, we need to configure the network connection. Each action provides a **Global Settings** section. Expand it to configure the network settings for all actions.

- **Send IP:** The IP address of the host running Reaper/Ultraschall. If this is the same host as the Stream Deck is connected to, use the local host address `127.0.0.1` (default).
- **Send Port:** The port, the host specified by `Send IP` is listening on for OSC commands. This is configured in the Reaper and the Soundboard settings – see below for details. (Default: `8050`)
- **Receive Port:** The port, this Stream Deck plugin is listening on for OSC feedback like recording time, soundboard progress and several statuses. You also need to configure this in the Reaper and the soundboard settings – see below for details. (Default: `9050`).

## Prepare Reaper
You need to configure Reaper to receive and send OSC commands:

1. Open **Settings** › **Control/OSC/web**
2. Click **Add** below the list to create a new controller.
3. Select **OSC (Open Sound Control)** from the list.
4. Select **Mode** **Configure device IP+local port**

Assuming, that Reaper and Stream Deck are running on the same system, you only have to care about these values:

- **Device port:** Change to `9050` or another value you configured for the **Receive Port** of the plugin.
- **Local listen port:** If you are using the Soundboard leave the `8000` here – otherwise adjust it to `8050` or any other value you've configured for **Send Port** in the plugin.

## Prepare Soundboard
1. Create a soundboard track
2. Bring up the soundboard settings by clicking the gear icon in the upper right of the soundboard window.
3. Ensure that the ports are configured like this:
   - **Receive:** `8050` (default)
   - **Send:** `9050` (default)
   - **Repeater:** `8000` (default)
4. Ensure, that the checkboxes for **Receive**, **Send** and **Repeater** are checked.

**Tip:** You can also configure the ducking level for the soundboard in this screen, which is also used by the duck action of the plugin.

## Explanation of the Setup
If you've setup everything like mentioned above this is the OSC command flow when you press a button on your stream deck:

1. The plugin sends the command to port `8050`.
2. The soundboard is listening on this port. It processes the command and forwards it to the specified repeater port `8000`.
3. Reaper's OSC engine is listening on this port and processes the command.

Feedback from Reaper and the soundboard is send to `9050` and therefore received by the plugin.