module.exports = function Vanguardian(dispatch) {
	let cid,
		player = '',
		battleground,
		inbattleground,
		alive,
		questid = 0,
		timeout = null,
		timeoutdaily = null,
		timeoutweekly = null,
		daily = 0,
		weekly = 0,
		enabled = true
		
	// ############# //
	// ### Magic ### //
	// ############# //
		
	dispatch.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, event => {
		if(!enabled) return
		questid = event.id
		if(questid != 0) {
			timeout = setTimeout(CompleteQuest, 2000) // try to complete the quest after 2 seconds
		}
		return false
	})
	
	dispatch.hook('S_AVAILABLE_EVENT_MATCHING_LIST', 1, event => {
		if(!enabled) return
		daily = event.unk5
		weekly = event.unk6
		if(daily == 3 || daily == 8) {
			timeoutdaily = setTimeout(CompleteDaily, 3000)
		}
		if(weekly == 15) {
			timeoutweekly = setTimeout(CompleteQuest, 3500)
		}
	})
	
	function CompleteQuest() {
		clearTimeout(timeout)
		if(!enabled) return
		if(alive && !inbattleground) { // if alive and not busy
			dispatch.toServer('C_COMPLETE_DAILY_EVENT', 1, { id: questid })
			questid = 0
		}
		else timeout = setTimeout(CompleteQuest, 5000) // if dead or busy, retry to complete quest after 5 seconds
	}
	
	function CompleteDaily() {
		clearTimeout(timeoutdaily)
		if(!enabled) return
		if(alive && !inbattleground) { // if alive and not busy
			dispatch.toServer('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 })
		}
		else timeoutdaily = setTimeout(CompleteDaily, 5000) // if dead or busy, retry to complete quest after 5 seconds
	}
	
	function CompleteWeekly() {
		clearTimeout(timeoutweekly)
		if(!enabled) return
		if(alive && !inbattleground) { // if alive and not busy
			dispatch.toServer('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 })
		}
		else timeoutweekly = setTimeout(CompleteWeekly, 5000) // if dead or busy, retry to complete quest after 5 seconds
	}
	
	// ############## //
	// ### Checks ### //
	// ############## //
		
	dispatch.hook('S_LOGIN', 1, event => { 
		({cid} = event)
		player = event.name
		questid = 0
		daily = 0
		weekly = 0
		timeout = null
		timeoutdaily = null
		timeoutweekly = null
	})
	
	dispatch.hook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, event => { battleground = event.zone })
	dispatch.hook('S_LOAD_TOPO', 1, event => {
		inbattleground = event.zone == battleground
	})
	
	dispatch.hook('S_SPAWN_ME', 1, event => { alive = event.alive })
	dispatch.hook('S_CREATURE_LIFE', 1, event => {
		if(event.target.equals(cid)) {
			alive = event.alive
		}
	})
	
	// ################# //
	// ### Chat Hook ### //
	// ################# //
	
	dispatch.hook('C_WHISPER', 1, (event) => {
		if(event.target.toUpperCase() === "!vanguardian".toUpperCase()) {
			if (/^<FONT>on?<\/FONT>$/i.test(event.message)) {
				enabled = true
				message('Vanguardian <font color="#56B4E9">enabled</font>.')
			}
			else if (/^<FONT>off?<\/FONT>$/i.test(event.message)) {
				enabled = false
				message('Vanguardian <font color="#E69F00">disabled</font>.')
			}
			else message('Commands:<br>'
								+ ' "on" (enable Vanguardian),<br>'
								+ ' "off" (disable Vanguardian)'
						)
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_WHISPER', 1, {
			player: cid,
			unk1: 0,
			gm: 0,
			unk2: 0,
			author: '!Vanguardian',
			recipient: player,
			message: msg
		})
	}
	
	dispatch.hook('C_CHAT', 1, event => {
		if(/^<FONT>!vg<\/FONT>$/i.test(event.message)) {
			if(!enabled) {
				enabled = true
				message('Vanguardian <font color="#56B4E9">enabled</font>.')
				console.log('Vanguardian enabled.')
			}
			else {
				enabled = false
				message('Vanguardian <font color="#E69F00">disabled</font>.')
				console.log('Vanguardian disabled.')
			}
			return false
		}
	})
}
