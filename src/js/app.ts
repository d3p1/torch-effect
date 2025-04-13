/**
 * @description App
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
import Mathy from './utils/mathy.ts'
import {V3, V4} from './types'

const DARK: V4 = [0, 0, 0, 0.8]
const COLOR: V3 = [30, 140, 50]
const COLOR_THRESHOLD: number = 10

class App {
  /**
   * @type {CanvasRenderingContext2D}
   */
  #context: CanvasRenderingContext2D

  /**
   * @type {HTMLCanvasElement}
   */
  #canvas: HTMLCanvasElement

  /**
   * @type {HTMLVideoElement}
   */
  #video: HTMLVideoElement

  /**
   * @type {number}
   */
  #torchLightRadius: number

  /**
   * Constructor
   */
  constructor() {
    this.#initCanvas()
    this.#initVideo()
  }

  /**
   * Animate
   *
   * @returns {void}
   */
  #animate(): void {
    this.#context.drawImage(this.#video, 0, 0)

    this.#postProcessing()

    requestAnimationFrame(this.#animate.bind(this))
  }

  /**
   * Post-processing
   *
   * @returns {void}
   */
  #postProcessing(): void {
    const {data} = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height,
    )

    const torch = []
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i + 0]
      const g = data[i + 1]
      const b = data[i + 2]

      if (Mathy.processSquareDistance(COLOR, [r, g, b]) < COLOR_THRESHOLD) {
        const x = (i / 4) % this.#canvas.width
        const y = Math.floor(i / 4 / this.#canvas.width)
        torch.push([x, y])
      }
    }

    if (torch.length) {
      const center = [0, 0]
      for (const pixel of torch) {
        center[0] += pixel[0]
        center[1] += pixel[1]
      }
      center[0] /= torch.length
      center[1] /= torch.length

      const torchLightRadius =
        this.#torchLightRadius - Math.random() * this.#torchLightRadius * 0.2
      const torchLight = this.#context.createRadialGradient(
        center[0],
        center[1],
        torchLightRadius * 0.2,
        center[0],
        center[1],
        torchLightRadius * 0.5,
      )
      torchLight.addColorStop(0, `rgba(0, 0, 0, 0)`)
      torchLight.addColorStop(
        1,
        `rgba(${DARK[0]}, ${DARK[1]}, ${DARK[2]}, ${DARK[3]})`,
      )

      this.#context.beginPath()
      this.#context.fillStyle = torchLight
      this.#context.arc(center[0], center[1], torchLightRadius, 0, 2 * Math.PI)
      this.#context.fill()
    } else {
      this.#context.beginPath()
      this.#context.fillStyle = `rgba(${DARK[0]}, ${DARK[1]}, ${DARK[2]}, ${DARK[3]})`
      this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
    }
  }

  /**
   * Init video
   *
   * @returns {void}
   */
  #initVideo(): void {
    navigator.mediaDevices
      .getUserMedia({video: true, audio: false})
      .then((stream) => {
        this.#video = document.createElement('video')
        this.#video.srcObject = stream

        this.#video.addEventListener('loadeddata', () => {
          this.#canvas.width = this.#video.videoWidth
          this.#canvas.height = this.#video.videoHeight

          this.#initTorchStyles()
        })

        this.#video.play().then(() => {
          this.#animate()
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  /**
   * Init torch styles
   *
   * @returns {void}
   */
  #initTorchStyles(): void {
    this.#torchLightRadius = Math.hypot(this.#canvas.width, this.#canvas.height)
  }

  /**
   * Init canvas
   *
   * @returns {void}
   */
  #initCanvas(): void {
    this.#canvas = document.createElement('canvas')
    this.#context = this.#canvas.getContext('2d') as CanvasRenderingContext2D

    document.body.appendChild(this.#canvas)
  }
}
new App()
