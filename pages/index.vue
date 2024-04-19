<script setup>
import PlayIcon from "../components/icons/IconPlay.vue"
import StopIcon from "../components/icons/IconStop.vue"

const video = ref(null)
const mediaStream = ref(null)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const recording = ref(false)
const recordedVideo = ref(null)
const stopStatus = ref(false)
const downloadStatus = ref(false)

const startRecording = async () => {
  try {
    mediaStream.value = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: "browser",
      },
    })

    mediaRecorder.value = new MediaRecorder(mediaStream.value)
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data)
      }
    }
    mediaRecorder.value.onstop = () => {
      // const blob = new Blob(recordedChunks.value, { type: "video/webm" })
      const blob = new Blob(recordedChunks.value, { type: "video/mp4" }) // 修改 MIME 類型為 video/mp4
      recordedVideo.value = window.URL.createObjectURL(blob)
    }
    mediaRecorder.value.start()
    recording.value = true
    stopStatus.value = true
  } catch (error) {
    console.error("錄影發生錯誤：", error)
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && recording.value) {
    mediaRecorder.value.stop()
    mediaStream.value.getTracks().forEach((track) => track.stop())
    recording.value = true
    stopStatus.value = false
    downloadStatus.value = true
  }
  downloadVideo()
  // recordedChunks.value = []
}

const download = (filename, inputwds) => {
  var tmpLink = document.createElement("a")
  tmpLink.setAttribute(
    "href",
    "data:text/plain;charset=utf-8, " + encodeURIComponent(inputwds)
  )
  tmpLink.setAttribute("download", filename)
  document.body.appendChild(tmpLink)
  tmpLink.click()
  //document.body.removeChild(tmpLink);
}

const downloadVideo = () => {
  if (recordedVideo.value) {
    const a = document.createElement("a")
    a.href = recordedVideo.value
    // a.download = "recorded_video.webm"
    a.download = "recorded_video.mp4"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(recordedVideo.value)
    recordedVideo.value = null
  }

  downloadStatus.value = false
  recordedChunks.value = []
}

watch(recordedVideo, (newVal, oldVal) => {
  if (newVal) {
    stopRecording()
    downloadStatus.value = true
    stopStatus.value = false
    recording.value = false
  }
})
</script>

<template lang="pug">
.content 
  video(ref="video" controls)
  button( @click="startRecording" v-if="!recording")
    PlayIcon
  button( @click="stopRecording" v-if="stopStatus")
    StopIcon
  //- button( @click="downloadVideo" :disabled="!downloadStatus") 下載錄影
  //- button(@click='checkStatus') check
</template>

<style lang="stylus">
video
  display none

.content
  size(,100vh)
  flex()
  // background-color #222
  // border 1px solid #000
  box-sizing border-box

  button
    size(auto)
    flex()
    margin 1rem
    background-color #fff
    cursor pointer
    svg
      size(120px)
</style>
