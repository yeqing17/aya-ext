import className from 'licia/className'
import { PointerEvent, useEffect, useRef } from 'react'
import { t } from 'common/util'
import { RemoteKeyDefinition } from 'common/remote-controller'
import Style from './RemoteControllerModal.module.scss'

interface IProps {
  remoteKey: RemoteKeyDefinition
  className?: string
  disabled?: boolean
  onPress: (keyCode: number) => Promise<void>
}

export default function RemoteKeyButton(props: IProps) {
  const { remoteKey } = props
  const label = t(remoteKey.label)
  const repeatTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const activePointer = useRef<number>(undefined)
  const gesture = useRef(0)

  useEffect(() => {
    if (!remoteKey.repeatable) {
      return
    }
    const handleBlur = () => stopRepeat()
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
      stopRepeat()
    }
  }, [remoteKey.repeatable])

  useEffect(() => {
    if (props.disabled) {
      stopRepeat()
    }
  }, [props.disabled])

  async function press(token: number) {
    try {
      await props.onPress(remoteKey.keyCode)
    } catch {
      if (token === gesture.current) {
        stopRepeat()
      }
    }
  }

  function startRepeat(event: PointerEvent<HTMLButtonElement>) {
    if (
      !remoteKey.repeatable ||
      event.button !== 0 ||
      activePointer.current !== undefined
    ) {
      return
    }
    event.preventDefault()
    activePointer.current = event.pointerId
    const token = ++gesture.current
    event.currentTarget.setPointerCapture(event.pointerId)
    void press(token)
    repeatTimer.current = setTimeout(() => repeat(token), 400)
  }

  async function repeat(token: number) {
    if (token !== gesture.current) {
      return
    }
    await press(token)
    if (token === gesture.current) {
      repeatTimer.current = setTimeout(() => repeat(token), 120)
    }
  }

  function stopRepeat(event?: PointerEvent<HTMLButtonElement>) {
    if (event && event.pointerId !== activePointer.current) {
      return
    }
    clearTimeout(repeatTimer.current)
    repeatTimer.current = undefined
    activePointer.current = undefined
  }

  return (
    <button
      type="button"
      className={className(Style.keyButton, props.className)}
      title={label}
      aria-label={label}
      disabled={props.disabled}
      onClick={(event) => {
        if (!remoteKey.repeatable || event.detail === 0) {
          void press(gesture.current)
        }
      }}
      onPointerDown={startRepeat}
      onPointerUp={(event) => stopRepeat(event)}
      onPointerCancel={(event) => stopRepeat(event)}
      onLostPointerCapture={(event) => stopRepeat(event)}
    >
      {remoteKey.icon ? (
        <span className={`icon-${remoteKey.icon}`} aria-hidden="true" />
      ) : (
        <span className={Style.keyText} aria-hidden="true">
          {remoteKey.text}
        </span>
      )}
    </button>
  )
}
