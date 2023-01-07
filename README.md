A plugin for [Elgato's Stream Deck](https://www.elgato.com/de/stream-deck-mk2), which makes recording with the awesome podcast software [Ultraschall](https://ultraschall.fm) even more fun.

> **Note**
> This is currently work in progress and the below mentioned features aren't available yet.

In contrast to [Ultraschall's official stream deck plugin](https://github.com/Ultraschall/ultraschall-stream-deck-plugin), this one fully focuses on podcast recording and provides enhanced feedback on the stream deck like recording time and remaining time for soundboard clips.

Here is the full list of actions supported:

- [x] Start/stop recording 
- [x] Mute keys for each track using one of these modes
  - [x] Toggle mute
  - [x] Push to mute
  - [x] Push to talk
- [x] Set marker (chapter mark or edit mark)
- [x] Trigger soundboard clip including visual feedback of the remaining time and option for fade-in, fade-out
- [ ] Duck soundboard (decrease soundboard volume to talk over background music)

## Technical Stuff
To make the feedback stuff possible, this plugin uses OSC for communication with Reaper and Ultraschall. To make OSC communication work, we cannot use the standard stream deck JavaScript API, because the plugin would run in a browser environment which would not allow us to establish UDP connections. 

Thus, this plugin is running on nodeJS which is not among the languages/platforms propagated by the [stream deck SDK](https://developer.elgato.com/documentation/https://developer.elgato.com/documentation/). So most of the work which ran into this plugin was investigation for how to setup a nodeJS-based plugin. 