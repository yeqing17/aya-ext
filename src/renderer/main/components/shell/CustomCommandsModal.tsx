import LunaModal from 'luna-modal/react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { t } from 'common/util'
import truncate from 'licia/truncate'
import ToolbarIcon from 'share/renderer/components/ToolbarIcon'
import { IModalProps } from 'share/common/types'
import Style from './CustomCommandsModal.module.scss'

interface ICommand {
  title: string
  command: string
}

export default function CustomCommandsModal(props: IModalProps) {
  const [commands, setCommands] = useState<ICommand[]>([])
  const [title, setTitle] = useState('')
  const [command, setCommand] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (props.visible) {
      loadCommands()
      resetForm()
    }
  }, [props.visible])

  async function loadCommands() {
    const saved = await main.getSettingsStore('customCommands')
    if (saved) {
      setCommands(saved as ICommand[])
    } else {
      setCommands([])
    }
  }

  async function saveCommands(newCommands: ICommand[]) {
    setCommands(newCommands)
    await main.setSettingsStore('customCommands', newCommands)
  }

  function resetForm() {
    setTitle('')
    setCommand('')
    setEditingIndex(null)
  }

  function handleSubmit() {
    if (!title.trim() || !command.trim()) return

    if (editingIndex !== null) {
      const newCommands = [...commands]
      newCommands[editingIndex] = { title: title.trim(), command: command.trim() }
      saveCommands(newCommands)
    } else {
      saveCommands([...commands, { title: title.trim(), command: command.trim() }])
    }
    resetForm()
  }

  function handleEdit(index: number) {
    const cmd = commands[index]
    setTitle(cmd.title)
    setCommand(cmd.command)
    setEditingIndex(index)
  }

  function handleDelete(index: number) {
    const cmd = commands[index]
    if (confirm(t('deleteCommandConfirm').replace('{{name}}', cmd.title))) {
      const newCommands = commands.filter((_, i) => i !== index)
      saveCommands(newCommands)
      if (editingIndex === index) {
        resetForm()
      }
    }
  }

  return createPortal(
    <LunaModal
      title={t('manageCommands')}
      width={480}
      visible={props.visible}
      onClose={props.onClose}
    >
      <div className={Style.container}>
        {commands.length > 0 ? (
          <div className={Style.commandList}>
            {commands.map((cmd, index) => (
              <div className={Style.commandRow} key={index}>
                <div className={Style.commandInfo}>
                  <div className={Style.commandTitle}>{cmd.title}</div>
                  <div className={Style.commandText}>
                    {truncate(cmd.command, 60)}
                  </div>
                </div>
                <div className={Style.commandActions}>
                  <ToolbarIcon
                    icon="check"
                    title={t('edit')}
                    onClick={() => handleEdit(index)}
                  />
                  <ToolbarIcon
                    icon="delete"
                    title={t('delete')}
                    onClick={() => handleDelete(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={Style.emptyTip}>{t('noData')}</div>
        )}
        <div className={Style.inputArea}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('commandTitle')}
          />
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={t('commandContent')}
          />
          <ToolbarIcon
            icon={editingIndex !== null ? 'check' : 'add'}
            title={editingIndex !== null ? t('editCommand') : t('addCommand')}
            onClick={handleSubmit}
          />
          {editingIndex !== null && (
            <ToolbarIcon
              icon="clear"
              title={t('cancel')}
              onClick={resetForm}
            />
          )}
        </div>
      </div>
    </LunaModal>,
    document.body
  )
}
