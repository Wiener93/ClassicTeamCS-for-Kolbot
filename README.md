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
		Ranged: false,   
		PreAttack: [0, 0, 0],  
		doPrecastAtRiver = true;  
		},  

3. Add this in your Sorcs Character Config:
  
	Scripts.ClassicTeamTaxi = true;   
		Config.ClassicTeamTaxi.Diablo = 0; // -1 = get ES no dia, 0 = no ES and kill dia, 1 = get ES and dia  
		Config.ClassicTeamTaxi.SealOrder = [1, 2, 3]; // order of seals 1: vizier, 2: seis, 3: infector  
		Config.ClassicTeamTaxi.PreAttack = [1, 1, 1]; // preattack count at each seal[/vizier/, /seis/, /infector/]   
		Config.ClassicTeamTaxi.SealFight = true; //true= sorc will fight at seals. false= go to town and wait for pala to clear  

4. Add this to the Char Configs of the rest of your teams chars:

	Scripts.ClassicTeamCS = true;   
		Config.ClassicTeamCS.Diablo = 0; // -1= go to town during diablo, 0= kill to death, 1= get exp shrine and kill diablo  
		Config.ClassicTeamCS.BO = false; // true = don't enter seals after boing at river, false = normal character that fights
		Config.ClassicTeamCS.Ranged = false; // true = ranged character, false = melee character   
		Config.ClassicTeamCS.PreAttack = [3, 3, 3]; // preattack count at each seal [/vizier/, /seis/, /infector/]  
    		Config.ClassicTeamCS.doPrecastAtRiver = true; // set to false if char is a barb that isnt supposed to bo

Set the Diablo killer/ Main Char as leader for all chars ecxapt himself.

Use RAW format to copy& paste
