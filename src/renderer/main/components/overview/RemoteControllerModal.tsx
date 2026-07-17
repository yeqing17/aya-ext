import LunaModal from 'luna-modal/react'
import { observer } from 'mobx-react-lite'
import { createPortal } from 'react-dom'
import { t } from 'common/util'
import {
  getRemoteKey,
  getRemoteKeys,
  RemoteKeyDefinition,
} from 'common/remote-controller'
import { IModalProps } from 'share/common/types'
import { notify } from 'share/renderer/lib/util'
import Style from './RemoteControllerModal.module.scss'
import store from '../../store'
import RemoteKeyButton from './RemoteKeyButton'

const dpadKeys = {
  center: requiredKey('dpadCenter'),
  up: requiredKey('dpadUp'),
  right: requiredKey('dpadRight'),
  down: requiredKey('dpadDown'),
  left: requiredKey('dpadLeft'),
}

export default observer(function RemoteControllerModal(props: IModalProps) {
  async function inputKey(keyCode: number) {
    const device = store.device
    if (!device) {
      return
    }

    try {
      await main.inputKey(device.id, keyCode)
    } catch (error) {
      notify(t('inputKeyErr'), { icon: 'error' })
      throw error
    }
  }

  function renderKey(remoteKey: RemoteKeyDefinition, className?: string) {
    return (
      <RemoteKeyButton
        key={remoteKey.id}
        remoteKey={remoteKey}
        className={className}
        disabled={!store.device}
        onPress={inputKey}
      />
    )
  }

  return createPortal(
    <LunaModal
      title={t('remoteController')}
      width={460}
      visible={props.visible}
      onClose={props.onClose}
    >
      <div className={Style.remoteController}>
        <section className={Style.section}>
          <h3>{t('systemControls')}</h3>
          <div className={Style.controlRow}>
            {getRemoteKeys('system').map((key) => renderKey(key))}
          </div>
        </section>

        <div className={Style.directionPad}>
          {renderKey(dpadKeys.center, Style.ok)}
          {renderKey(dpadKeys.up, Style.up)}
          {renderKey(dpadKeys.right, Style.right)}
          {renderKey(dpadKeys.down, Style.down)}
          {renderKey(dpadKeys.left, Style.left)}
        </div>

        <section className={Style.section}>
          <h3>{t('navigationControls')}</h3>
          <div className={Style.controlRow}>
            {getRemoteKeys('navigation').map((key) => renderKey(key))}
          </div>
        </section>

        <section className={Style.section}>
          <h3>{t('mediaControls')}</h3>
          <div className={Style.mediaGrid}>
            {getRemoteKeys('media').map((key) => renderKey(key))}
          </div>
        </section>

        <details className={Style.moreControls}>
          <summary>{t('moreControls')}</summary>
          <div className={Style.extraGrid}>
            {getRemoteKeys('extra').map((key) => renderKey(key))}
          </div>
          <h3>{t('tvControls')}</h3>
          <p>{t('tvControlsHint')}</p>
          <div className={Style.extraGrid}>
            {getRemoteKeys('tv').map((key) => renderKey(key))}
          </div>
          <div className={Style.numberGrid}>
            {getRemoteKeys('number').map((key) => renderKey(key))}
          </div>
        </details>
      </div>
    </LunaModal>,
    document.body
  )
})

function requiredKey(id: string) {
  return getRemoteKey(id) as RemoteKeyDefinition
}
