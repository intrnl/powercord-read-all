const { Plugin } = require('powercord/entities')
const { ContextMenu: { Button: CMButton } } = require('powercord/components')
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')


class ReadAll extends Plugin {
  startPlugin () {
    this._patchContextMenu()
  }

  pluginWillUnload () {
    uninject('powercord-read-all_cm')
  }

  _patchContextMenu () {
    const GuildContextMenu = getModuleByDisplayName('GuildContextMenu', false)
    const GuildStore = getModule(['getGuilds'], false)
    const GuildActions = getModule(['markGuildAsRead'], false)

    inject('powercord-read-all_cm', GuildContextMenu.prototype, 'render', (_, res) => {
      res.props.children[0].props.children = [
        res.props.children[0].props.children,
        React.createElement(CMButton, {
          name: 'Mark All As Read',
          onClick: () => {
            for (let guild in GuildStore.getGuilds()) {
              GuildActions.markGuildAsRead(guild)
            }
          },
        }),
      ]

      return res
    })
  }
}

module.exports = ReadAll
