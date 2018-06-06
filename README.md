# ClassicTeamCS-for-Kolbot

1. Put ClassicTeamCS.js and ClassicTeamTaxi.js in your ...\d2bot-with-kolbot-master\d2bs\kolbot\libs\bots folder.

2. Copy& paste the following right under line 292 (// Script specific) in Config.js in your ...\d2bot-with-kolbot-master\d2bs\kolbot\libs\common directory:

	ClassicTeamTaxi: {  
      Diablo: 0,  
      SealOrder: [1, 2, 3],  
      PreAttack: [0, 0, 0],  
	  SealFight: true  
	},  
	ClassicTeamCS: {  
      Leader: "",  
      Diablo: 0,  
      BO: false,  
      Leech: false,  
      Ranged: false,  
      SealPrecast: false,  
      PreAttack: [0, 0, 0]  
	},  
  
3. Add this in your Sorcs Character Config:
  
  Scripts.ClassicTeamTaxi = true;   
		Config.ClassicTeamTaxi.Diablo = 0; // -1 = get exp shrine and stay at town, 0 = no exp shrine and straight kill dia, 1 = get exp shrine and help at dia  
		Config.ClassicTeamTaxi.SealOrder = [1, 2, 3]; // order in which the taxi will go through cs, 1: vizier, 2: seis, 3: infector  
		Config.ClassicTeamTaxi.PreAttack = [1, 1, 1]; // preattack count at each seal, count = number of attacks, so if hdin and 5, it will cast 5 hammers; useful for clearing tp's for safer entry, enter values in the following order: [/vizier/, /seis/, /infector/]   
		Config.ClassicTeamTaxi.SealFight = true; // if true sorc will fight at seals. if false she will go to town and wait for pala to clear  

4. Add this to the Char Configs of the rest of your teams chars:

	Scripts.ClassicTeamCS = true;   
		Config.ClassicTeamCS.Diablo = 0; // -1 = go to town during diablo, 0 = kill to death, 1 = get exp shrine and kill diablo  
		Config.ClassicTeamCS.Leech = false; // true = hide during diablo, false = stay at star  
		Config.ClassicTeamCS.Ranged = false; // true = ranged character, false = melee character   
		Config.ClassicTeamCS.BO = false; // true = don't enter seals after boing at river, false = normal character that fights  
		Config.ClassicTeamCS.SealPrecast = false; // true = does precast sequence at every seal, false = does not precast at seal  
		Config.ClassicTeamCS.PreAttack = [3, 10, 10]; // preattack count at each seal, useful for clearing tp's for safer entry, enter values in the following order: [/vizier/, /seis/, /infector/]  
    
5. For Barb use the regular BattleOrders Script and change the waypoint from 35 to 104.
