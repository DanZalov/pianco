// uses global.Tone
import { allOff } from '../instrument.js'


export const instrumentApp = new Vue({
  el: '#instrument-app',
  data: {
    muted: false,
    volume: 100,
    minVolume: 0,
    maxVolume: 100,
    stepVolume: 5,
    instrument: 'none',
    midiEnabled: false,
    midiTooltip: 'MIDI in',
    isFramed: window.parent !== window,
  },
  computed: {
  },
  watch: {
    instrument (newInstrument, oldInstumen) {
      allOff()
      // TODO - blur on click?
    },
    volume (newVolume, oldVolume) {
      const toDb = (v) => (v / 100 * 40 - 40) // 0..100 % to -40..0 dB
      if (oldVolume === newVolume) {
        return
      }
      Tone.getDestination().volume.value = toDb(newVolume)
      if (newVolume <= +this.minVolume) {
        Tone.getDestination().mute = true
      } else {
        Tone.getDestination().mute = false
      }
    }
  },
  methods: {
    changeInstrument (e) {
      if (this.midiEnabled){
        this.instrument = {
          'sampledPiano': 'midiout',
          'midiout': 'sampledPiano'
        }[this.instrument] || 'none'
      } else {
        this.instrument = {
          'sampledPiano': 'sampledPiano',
        }[this.instrument] || 'none'
      }
    },
    scrollVolume (e) {
      if (this.muted) {
        return
      }
      // TODO - normalize deltaY (may differ browser from browser)
      const val = Math.max(
        +this.minVolume,
        Math.min(
          Math.sign(-e.deltaY) * +this.stepVolume + +this.volume,
          +this.maxVolume,
        ),
      )
      this.volume = val
    },
    toggleMute () {
      this.muted = !this.muted
      if (this.muted) {
        Tone.getDestination().mute = true
      } else {
        Tone.getDestination().mute = false
      }
    },
  },
})
