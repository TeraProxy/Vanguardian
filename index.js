'use strict'

module.exports = function Vanguardian(mod) {

	let timeout = null,
		daily = 0,
		weekly = 0,
		finishedQuests = [],
		niceName = mod.proxyAuthor !== 'caali' ? '[VG] ' : ''

	// ############# //
	// ### Hooks ### //
	// ############# //

	mod.game.on('enter_game', () => {
		daily = weekly = 0
		timeout = null
	})

	mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, event => {
		daily++
		weekly++
		if(!mod.settings.enabled) return
		finishedQuests.push(event.id)
		timeout = setTimeout( () => { CompleteQuest() }, 2000) // try to complete the quest after 2 seconds
		return false
	})

	mod.hookOnce('S_AVAILABLE_EVENT_MATCHING_LIST', 1, event => {
		daily = event.unk4
		weekly = event.unk6
	})

	// ################# //
	// ### Functions ### //
	// ################# //

	function CompleteQuest() {
		clearTimeout(timeout)
		if(!mod.settings.enabled) return
		if(mod.game.me.alive && !mod.game.me.inBattleground) {
			if(finishedQuests.length) {
				for(let id of finishedQuests) {
					mod.toServer('C_COMPLETE_DAILY_EVENT', 1, { id })
					if(daily == 3 || daily == 8) setTimeout( () => { CompleteExtra(1) }, 1000)
					if(weekly == 16) setTimeout( () => { CompleteExtra(0) }, 1500)
				}
				finishedQuests = []
			}
			report()
		}
		else timeout = setTimeout( () => { CompleteQuest() }, 5000) // if dead or in battleground, retry to complete quest after 5 seconds
	}

	function CompleteExtra(type) {
		if(mod.settings.enabled) mod.toServer('C_COMPLETE_EXTRA_EVENT', 1, { type }) // 0 = weekly, 1 = daily
	}

	function report() {
		if(daily < 16) mod.command.message(niceName + 'Daily Vanguard Requests completed: ' + daily)
		else mod.command.message(niceName + 'You have completed all 16 Vanguard Requests today.')
	}

	// ################ //
	// ### Commands ### //
	// ################ //

	mod.command.add('vg', (param) => {
		if(param == null) {
			mod.settings.enabled = !mod.settings.enabled
			mod.command.message(niceName + 'Vanguardian ' + (mod.settings.enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
			console.log('Vanguardian ' + (mod.settings.enabled ? 'enabled' : 'disabled'))
		}
		else if(param == "daily") report()
		else mod.command.message('Commands:\n'
							+ ' "vg" (enable/disable Vanguardian),\n'
							+ ' "vg daily" (Tells you how many Vanguard Requests you completed today")'
		)
	})
}