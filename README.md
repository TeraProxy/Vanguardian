##### :heavy_exclamation_mark: Status :heavy_exclamation_mark:
Should work on all regions as long as the opcodes are mapped. Works on Caali's and Pinkie Pie's tera-proxy.

##### :heavy_exclamation_mark: Installation :heavy_exclamation_mark:
1) Download Vanguardian: https://github.com/TeraProxy/Vanguardian/archive/master.zip
2) Extract the contents of the zip file into "\tera-proxy\mods\"
3) Done! (the module will auto-update on Caali's tera-proxy when a new version is released)

Users of Pinkie's proxy also need to install tera-game-state: https://github.com/caali-hackerman/tera-game-state/archive/master.zip  
  
If you enjoy my work and wish to support future development, feel free to drop me a small donation: [![Donate](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=A3KBZUCSEQ5RJ)

# Vanguardian
A tera-proxy module that automatically finishes Vanguard Initiative quests on completion and gives you a report about how many quests you already finished today.  
It finishes the quest 2 seconds after it got completed if you are able to finish it.  
If you are dead or in a battleground, it will recheck if the quest can be completed every 5 seconds.

## Usage
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* **vg** - enable/disable Vanguardian  
* **vg daily** - tells you how many Vanguard Requests you completed today (need to open VG menu at least once before)

## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.

## Changelog
<details>

### 1.3.0
* [+] Enabled/disabled state is now saved to a config file and reloaded the next time you login
### 1.2.9
* [*] Fixed rare case where the amount of completed Vanguard Requests was incorrect
* [~] Use tera-game-state for battleground info
* [+] Readded support for Pinkie Pie's tera-proxy
* [-] Removed unneeded timeouts
### 1.2.8
* [~] Changed html line breaks to proper ones
### 1.2.7
* [~] Code changes due to Caali's recent tera-proxy updates
* [-] Removed support for Pinkie Pie's tera-proxy
### 1.2.6
* [*] Fixed a weird case-sensitivity issue
* [*] More code cleanup
### 1.2.5
* [+] Rewrote code to use Caali's "tera-game-state" module in order to reduce overhead
* [+] Now supports auto-updating via Caali's tera-proxy
### 1.2.4
* [*] Updated hook versions for compatibility with the latest tera-proxy
### 1.2.3
* [*] Fixed trying to count dailies past the maximum number of 16
### 1.2.2
* [*] Made completion of daily and weekly quests more reliable
### 1.2.1
* [+] Added command to show the amount of completed daily Vanguard Requests
* [*] Arsenal patch update
### 1.2.0
* [*] Some code cleanup
* [*] Full conversion to Pinkie Pie's command module
### 1.1.0
* [+] Added automatic completion of daily and weekly bonus
### 1.0.0
* [~] Initial Release

</details>