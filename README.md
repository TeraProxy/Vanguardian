# Vanguardian
A tera-proxy module that automatically finishes Vanguard Initiative quests on completion.  
It finishes the quest 2 seconds after it got completed if you are able to finish it.  
If you are dead or in a battleground, it will recheck if the quest can be completed every 5 seconds.  
  
## Usage  
While ingame, open a whisper chat session with "!Vanguardian" by typing "/w !vanguardian" in chat and hitting the space bar.
This serves as the script's command interface. 
The following commands are supported:  
  
* on - Enables the script  
* off - Disables the script  
  
Any other input returns a summary of above commands in the game.
  
## Safety
Whatever you send to "!Vanguardian" ingame is intercepted client-side. The chat is NOT sent to the server.