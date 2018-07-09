/**
*        @filename        ClassicTeamTaxi.js
*        @author          wingman93 aka wiener93 based on noah~´s AutoTaxi.js
*        @desc            Part of the ClassicTeam system
*                          Clears seals at Chaos Sanctuary via taxi, can be used for Team CS
*/
function ClassicTeamTaxi() {
	var leader = Config.Leader
    this.precast = function (amount) {
        if (arguments.length > 0) {
            delay(amount);
        }

        var currx = me.x,
            curry = me.y,
            timeout = getTickCount(),
            count = timeout;




            
        while (!me.getState(32)){
			delay(100);
		}
		Precast.doPrecast();
    };
	
	this.getExpShrine = function () {
		delay(2000);
		Town.goToTown(4);
		Pather.useWaypoint(4);
		Precast.doPrecast(true);
		this.getShrine();
		Town.goToTown(1);
		var pal = getParty(leader);
		while (pal && pal.area !== 1) {
			delay(200);
		}
		Town.goToTown(4);
		Town.move("portalspot");
	};
	
	this.SealFight = function () {
		var pal = getParty(leader);
	
		if (Config.ClassicTeamTaxi.SealFight) { //if true
			print("fighting");
			while (pal && pal.area !== 108) {
				Attack.clear(20, 0xF, false, false); //clear area while pala is on the way to cs
			}
			while (pal && pal.area === 108) {
				Attack.clear(20, 0xF, false, false); //clear area while pala is in cs
			}
		}
	
		else { //if false
			print("waiting in town");
			Pather.usePortal(103, null)
			delay(1500);
			while (pal && pal.area == 103) {
				delay(10);
			}
			while (pal && pal.area !== 103) {
				delay(10);
			}
			Pather.usePortal(108, null);	
		
		}
	
	};

    this.vizier = function (stopAt) {
        var stop = stopAt,
            vizx = 7687,
            vizy = 5315;

        if (arguments.length < 1) {
            stop = 0;
        }

        if (Layout.vizier() === 1) {
            vizx = 7683;
            vizy = 5302;
        }
		var pal = getParty(leader);
        Pather.moveTo(vizx, vizy);
        Pather.makePortal(false);
		print("viz");
        Layout.openSeal(395);
        Layout.openSeal(396);
        Pather.moveTo(vizx, vizy);
		this.SealFight();
		print("viz dead");
        Pickit.pickItems();
    };
	

    this.seis = function (stopAt) {
        var stop = stopAt,
            seisx = 7775,
            seisy = 5193;

        if (arguments.length < 1) {
            stop = 0;
        }

        if (Layout.seis() === 1) {
            seisx = 7782;
            seisy = 5224;
        }
		var pal = getParty(leader);
        Pather.moveTo(seisx, seisy, 10);
        Pather.makePortal(false);
		print("seis");
        Layout.openSeal(394);
        Pather.moveTo(seisx, seisy, 10);
        Pather.teleDistance = 45;
		this.SealFight();
		print("seis dead");
        Pickit.pickItems();
    };

    this.infector = function (stopAt) {
        var stop = stopAt,
            infx = 7924,
            infy = 5282;

        if (arguments.length < 1) {
            stop = 0;
        }

        if (Layout.infector() === 1) {
            infx = 7926;
            infy = 5300;
        }
		var pal = getParty(leader);
        Pather.moveTo(infx, infy);
        Pather.makePortal(false);
		print("inf");
        Layout.openSeal(392);
        Pather.moveTo(infx, infy);
		this.SealFight();
        Layout.openSeal(393);
		print("inf dead");
        Pickit.pickItems();
    };
	
	
	this.getShrine = function () {
		var i
		for (var i = 4; i > 1; i -= 1) {
			if (Misc.getShrinesInArea(i, 15, false)) { // find shrine but do not take it
			say("Found Shrine");

			
			break;
			}
			
		}
	};
		
    this.diablo = function () {
        var i,
            pick,
            maxTime = 0,
            preCount = 1,
            postCount = 1,
            party = getParty();

        for (i = 0; i < 5; i += 1) {
            if (party) {
                while (party.getNext()) {
                    if (party.level >= 30) {
                        preCount += 1;
                    }
                }

                break;
            } else {
                delay(me.ping + 100);
                party = getParty();
            }
        }

        if (Config.ClassicTeamTaxi.Diablo === -1) { //Get exp shrine and wait in town for pala to kill dia
			var i
			print("-1");
            if (!Pather.usePortal(103, null)) {
                Town.goToTown();
			}
			this.getExpShrine();
        }
		
		else if (Config.ClassicTeamTaxi.Diablo === 0) { //Dont get an exp shrine and stay at dia
			print("0");
			while (pal && pal.area === 108) {
				delay(200);
			}
			this.slayBoss(3060, 0, 30, Config.ClassicTeamTaxi.Diablo);
			pick = getTickCount();

			while (getTickCount() - pick < 1500) {
				Pickit.pickItems();
				delay(me.ping + 100);
			}

			scriptBroadcast("quit");
		}
		
        else {  //Get an exp shrine for pala and help kill dia
			var i
			print("1");
            if (!Pather.usePortal(103, null)) {
                Town.goToTown();
			}
			this.getExpShrine();
			var pal = getParty(leader);
			while (pal && pal.area !== 103) {
				delay(5);
			}
			Pather.usePortal(108, null);
			this.slayBoss(3060, 0, 30, Config.ClassicTeamTaxi.Diablo);
			Town.goToTown(4);
			Town.doChores();
			
        }

        while (maxTime < 180000) {
            party = getParty();
            postCount = 1;

            if (party) {
                while (party.getNext()) {
                    if (party.level >= 30) {
                        postCount += 1;
                    }
                }

                if (postCount < preCount) {
                    break;
                }
            }

            maxTime += 3000;
            delay(3000);
        }

        scriptBroadcast("quit");
    };

    this.doAttack = function (bossId) {
        var player,
            boss = bossId;

        if (arguments.length < 1) {
            boss = null;
        }

        if (me.getState(121)) {
            if (boss) {
                Skill.cast(Config.AttackSkill[2], 0, boss.x, boss.y);
            } else {
                player = getUnit(0);

                if (player) {
                    Skill.cast(Config.AttackSkill[2], 0, player.x, player.y);
                }
            }
        } else if (boss) {
            Skill.cast(Config.AttackSkill[1], 0, boss.x, boss.y);
        } else {
            Skill.cast(Config.AttackSkill[1], 0, me.x, me.y);
        }
    };

    this.slayBoss = function (classid, preattack, retry, stop) {
        var boss = false,
            bosshp = 0,
            time = getTickCount(),
            name = getLocaleString(classid);

        retry = retry * 1000;

        while ((getTickCount() - time) < retry) {
            if (!boss) {
                boss = getUnit(1, name);
            } else if (preattack > 0) {
                preattack -= 1;
            } else {
                break;
            }

            if (classid !== 3060) {
                if (!boss) {
                    this.doAttack();
                } else {
                    this.doAttack({
                        x: boss.x,
                        y: boss.y
                    });
                }
            } else {
                delay(500);
            }

            delay(me.ping + 10);
        }

        if (!boss) {
            print("no boss found");
            return;
        }

        time = getTickCount();

        while ((getTickCount() - time) < retry) {
            if (!Attack.checkMonster(boss)) {
                return;
            }

            if (classid !== 3060) {
                Attack.deploy(boss, 15, 5, 9);
            }

            bosshp = parseInt(boss.hp * 100 / 128, 10);

            if (bosshp < stop) {
                return;
            }

            this.doAttack({
                x: boss.x,
                y: boss.y
            });

            if (classid === 3060) {
                try {
                    Attack.kill(boss);
                } catch (e) {}
            }

            delay(me.ping + 10);
        }
    };

    this.waitForParty = function (areaAt) {
        var party,
            area = areaAt,
            barb = false,
            pally = false,
            time = getTickCount();

        if (arguments.length < 1) {
            area = 0;
        }

        while ((!barb || !pally)) {
            party = getParty();
            do {
                if (party.classid === 4 && party.level >= 30) {
                    if (area > 0 && party.area !== me.area) {
                        continue;
                    }
                    print("barb found");
                    barb = true;
                } else if (party.classid === 3 && party.level >= 30) {
                    if (area > 0 && party.area !== me.area) {
                        continue;
                    }
                    print("pally found");
                    pally = true;
                }
            } while (party.getNext());

            delay(250);
        }


    };

    var i;
   
    if (me.area !== 103) {
        Pather.useWaypoint(103, true);
    }

    Town.doChores();
    Town.move("portalspot");
    this.waitForParty();
	delay(500);
    Pather.useWaypoint(107);
    Pather.makePortal(false);
    Pather.moveTo(me.x, me.y - 5);

    this.waitForParty(107);
    this.precast();

    Pather.moveTo(7797, 5606);
    Pather.moveTo(7797, 5590);

    for (i = 0; i < 3; i += 1) {
        if (Config.ClassicTeamTaxi.SealOrder[i] === 1) {
            this.vizier();
        } else if (Config.ClassicTeamTaxi.SealOrder[i] === 2) {
            this.seis();
        } else if (Config.ClassicTeamTaxi.SealOrder[i] === 3) {
            this.infector();
        } else {
            print("Invalid Config.ClassicTeamTaxi.SealOrder Settings");
        }
    }

    Pather.moveTo(7795, 5293);
    Pather.makePortal(false);
    this.diablo();

    scriptBroadcast("quit");
}

var Layout = new function () {
    this.openSeal = function (classid) {
        var i, seal, tick;

        for (i = 0; i < 5; i += 1) {
            Pather.moveToPreset(me.area, 2, classid, 2, 0);

            seal = getUnit(2, classid);

            if (!seal) {
                return false;
            }

            if (seal.mode) {
                return true;
            }

            seal.interact();

            tick = getTickCount();

            while (getTickCount() - tick < (classid === 394 ? 1000 : 500)) {
                if (seal.mode) {
                    return true;
                }

                delay(10);
            }

            if (!seal.mode) {
                if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) {
                    // de seis optimization
                    Pather.moveTo(seal.x + 15, seal.y);
                } else {
                    Pather.moveTo(seal.x - 5, seal.y - 5);
                }

                delay(300);
            } else {
                return true;
            }
        }

        return false;
    };

    this.get = function (seal, value) {
        var sealPreset = getPresetUnit(108, 2, seal);

        if (!seal) {
            throw new Error("Seal preset not found. Can't continue.");
        }

        if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
            return 1;
        }
        return 2;
    };

    this.vizier = function () {
        return this.get(396, 5275);
    };

    this.seis = function () {
        return this.get(394, 7773);
    };

    this.infector = function () {
        return this.get(392, 7893);
    };
}
