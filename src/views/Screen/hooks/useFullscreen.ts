import { onMounted, onUnmounted, ref } from 'vue'
import { isFullscreen, exitFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'

export default () => {
  const fullscreenState = ref(true)
  const escExit = ref(true)

  const { exitScreening } = useScreening()

  const handleFullscreenChange = () => {
    fullscreenState.value = isFullscreen()
    if (!fullscreenState.value && escExit.value) exitScreening()

    escExit.value = true
  }

  onMounted(() => {
    fullscreenState.value = isFullscreen()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari 兼容
    window.onmessage = (event) => {
      if (
        event.data.info === 'integration' &&
        event.data.type === 'exitFullscreen'
      ) {
        const docElm: any = document.documentElement
        if (docElm.exitFullscreen) docElm.exitFullscreen()
        else if (docElm.mozCancelFullScreen) docElm.mozCancelFullScreen()
        else if (docElm.webkitExitFullscreen) docElm.webkitExitFullscreen()
        else if (docElm.msExitFullscreen) docElm.msExitFullscreen()
      }
    }
  })
  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  })

  const manualExitFullscreen = () => {
    if (!fullscreenState.value) return
    escExit.value = false
    exitFullscreen()
  }

  return {
    fullscreenState,
    manualExitFullscreen,
  }
}