// Version 1.2.7

'use strict'

module.exports = function vanguardian(mod) {

	let battleground = null,
		inbattleground = false,
		timeout = null,
		timeoutdaily = null,
		timeoutweekly = null,
		daily = 0,
		weekly = 0,
		enabled = true

	// ############# //
	// ### Hooks ### //
	// ############# //

	mod.game.on('enter_game', () => {
		daily = weekly = 0
		timeout = timeoutdaily = timeoutweekly = null
	})

	mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, event => {
		timeout = setTimeout( () => { CompleteQuest(event.id) }, 2000) // try to complete the quest after 2 seconds
		return false
	})

	mod.hook('S_AVAILABLE_EVENT_MATCHING_LIST', 1, event => {
		daily = event.unk4
		weekly = event.unk6
	})

	// ############## //
	// ### Checks ### //
	// ############## //

	mod.hook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, event => { battleground = event.zone })

	mod.game.on('enter_loading_screen', () => {
		inbattleground = mod.game.me.zone == battleground
	})

	// ################# //
	// ### Functions ### //
	// ################# //

	function CompleteQuest(id) {
		clearTimeout(timeout)
		if(!enabled) return
		if(mod.game.me.alive && !inbattleground) {
			mod.toServer('C_COMPLETE_DAILY_EVENT', 1, { id })
			if(daily < 16) {
				daily++
				weekly++
				mod.command.message('You have completed ' + daily + ' Vanguard Requests today.')
			}
			else mod.command.message('You have completed all ' + daily + ' Vanguard Requests today.')
			if(daily == 3 || daily == 8) timeoutdaily = setTimeout( () => { CompleteExtra(1) }, 1000)
			if(weekly == 16) timeoutweekly = setTimeout( () => { CompleteExtra(0) }, 1500)
		}
		else timeout = setTimeout( () => { CompleteQuest(id) }, 5000) // if dead or in battleground, retry to complete quest after 5 seconds
	}

	function CompleteExtra(type) {
		clearTimeout(type == 1 ? timeoutdaily : timeoutweekly)
		if(!enabled) return
		if(mod.game.me.alive && !inbattleground)
			mod.toServer('C_COMPLETE_EXTRA_EVENT', 1, { type }) // 0 = weekly, 1 = daily
		else timeoutextra = setTimeout( () => { CompleteExtra(type) }, 5000) // if dead or in battleground, retry to complete quest after 5 seconds
	}

	// ################ //
	// ### Commands ### //
	// ################ //

	mod.command.add('vg', (param) => {
		if(param == null) {
			enabled = !enabled
			mod.command.message((enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
			console.log('[Vanguardian] ' + (enabled ? 'enabled' : 'disabled'))
		}
		else if(param == "daily")
			mod.command.message('You have completed ' + daily + ' Vanguard Requests today.')
		else mod.command.message('Commands:<br>'
							+ ' "vg" (enable/disable Vanguardian),<br>'
							+ ' "vg daily" (Tells you how many Vanguard Requests you completed today")'
		)
	})
}
