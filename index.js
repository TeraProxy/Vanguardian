module.exports = function Vanguardian(dispatch) {
	let cid,
		player = '',
		battleground,
		inbattleground,
		alive,
		questid = 0,
		timeout = null,
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
	
	function CompleteQuest() {
		clearTimeout(timeout)
		if(!enabled) return
		if(alive && !inbattleground) { // if alive and not busy
			dispatch.toServer('C_COMPLETE_DAILY_EVENT', 1, { id: questid })
			questid = 0
		}
		else timeout = setTimeout(CompleteQuest, 5000) // if dead or busy, retry to complete quest after 5 seconds
	}
	
	// ############## //
	// ### Checks ### //
	// ############## //
		
	dispatch.hook('S_LOGIN', 1, event => { 
		({cid} = event)
		player = event.name
		questid = 0
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
