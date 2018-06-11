/**
*        @filename        ClassicTeamCS.js
*        @author          wingman93 aka. wiener93 based on noah~´s AutoCS.js
*        @desc            Part of the ClassicTeam system
*                          Follows taxi Chaos Sanctuary runs, can be used for Team CS with any character class
*/
function ClassicTeamCS() {
	var pal = getParty(leader);
	var leader = Config.Leader
    this.taxi = "";
    this.tpID = 0;
    this.lastCall = 0;

    this.sealDistance = function (seal) {
        var sealPreset = getPresetUnit(108, 2, seal);

        if (!seal) {
            throw new Error("Seal preset not found. Can't continue.");
        }

        return (getDistance(me, sealPreset.roomx * 5 + sealPreset.x, sealPreset.roomy * 5 + sealPreset.y));
    };

    this.teleWalk = function (wX, wY, walkTo) {
        var mx, my, walk = walkTo,
            tick = getTickCount();

        if (tick - this.lastCall > 3500) {
            sendPacket(1, 0x5f, 2, wX, 2, wY);
            delay(25);
            sendPacket(1, 0x4b, 4, me.type, 4, me.gid);
            this.lastCall = getTickCount();

            while ((getTickCount() - tick) < 500) {
                mx = me.x;
                my = me.y;

                if (getDistance(mx, my, wX, wY) < 2) {
                    return;
                }
                delay(10);
            }
        }

        if (arguments.length < 3) {
            walk = true;
        }

        if (walk) {
            Pather.walkTo(wX, wY);
        }
    };

    this.setTaxi = function () {
        if (Config.ClassicTeamCS.Leader !== "") {
            var party = getParty();

            if (party) {
                do {
                    if (this.taxi.indexOf(party.name) > -1) {
                        this.taxi = party.name;
                        break;
                    }
                } while (party.getNext());
            }
        }

        this.taxi = this.detectTaxi();
    };

    this.detectTaxi = function () {
        var player = getParty(),
            current = "",
            lvl = 0;

        if (!player) {
            return current;
        }

        do {
            if (player.name !== me.name) {
                if (player.classid === 1 && lvl < player.level) {
                    if (Pather.getPortal(108, current) && !Pather.getPortal(108, player.name)) {
                        break;
                    }

                    current = player.name;
                    lvl = player.level;
                }
            }
        } while (player.getNext());

        return current;
    };

	
    this.doNext = function () {
        var portal;

        if (this.taxi === "") {
            return;
        }

        portal = Pather.getPortal(null, this.taxi);

        if (!portal || portal.gid === this.tpID) {
            return;
        }



        if (!Pather.usePortal(null, null, portal)) {
            return;
        }

        this.tpID = portal.gid;

        if (me.area === 107) {
            print("precast");
            this.precast();
			Precast.doPrecast(true);
        } else if (me.area === 108) {
            if (Config.ClassicTeamCS.SealPrecast) {
                Precast.doPrecast(true);
            }

            if (this.sealDistance(396) < 60) {
                print("viz");
                this.vizier();
            } else if (this.sealDistance(392) < 60) {
                print("fec");
                this.infector();
            } else if (this.sealDistance(394) < 80) {
                print("seis");
                this.seis();
            } else if (getDistance(me, 7795, 5293) < 30) {
                print("dia");
                this.diablo();
                scriptBroadcast("quit");
            } else {
                print("my location: " + me.x + " " + me.y + "seis: " + this.sealDistance(394));
                print("where the fuck am i...");
            }
        }
        Town.goToTown();
    };

    this.precast = function () {
        var sorc = getParty(this.taxi);
        Precast.doPrecast(true);

        while (sorc && sorc.area !== 108 && (!me.getState(32) || (me.classid === 4) || getUnit(0, this.taxi))) {
            delay(250);
            
        }
		Precast.doPrecast(true);
        if (!Pather.usePortal(null, this.taxi)) {
            Pather.useWaypoint(103);
        }

        if (Town.needHealing() || (Town.checkScrolls("tbk") < 10)) {
            Town.doChores();
        }

        Town.move("portalspot");
    };

    this.clearOut = function () {
		Attack.clear(20, 0xF, false, false);
        Pickit.pickItems();
        Pather.usePortal(103, null);
        if (!Pather.usePortal(103, null)) {
            Town.goToTown();
        }
        Town.move("portalspot");
    };

    this.vizier = function () {
        this.slayBoss(2851, Config.ClassicTeamCS.PreAttack[0], 10);
        this.clearOut();
    };

    this.seis = function () {
        this.slayBoss(2852, Config.ClassicTeamCS.PreAttack[1], 25);
        this.clearOut();
    };

    this.infector = function () {
        this.slayBoss(2853, Config.ClassicTeamCS.PreAttack[2], 10);
        this.clearOut();
    };

    this.diablo = function () {
        var i, pick, maxTime = 0,
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

        if (Config.ClassicTeamCS.Diablo === -1) {
            if (!Pather.usePortal(103, null)) {
                Town.goToTown();
            }
        } else if (!Config.ClassicTeamCS.Leech) {
            Pather.moveTo(7795, 5293);
            

            if (Config.ClassicTeamCS.Diablo === 0) {
				while (pal && pal.area !== 108) {
					delay(200);
				}
				this.slayBoss(3060, 0, 30, Config.ClassicTeamCS.Diablo);
                pick = getTickCount();
				
                while (getTickCount() - pick < 1500) {
                    Pickit.pickItems();
                    delay(me.ping + 100);
                }

                scriptBroadcast("quit");
            }
			
            if (Config.ClassicTeamCS.Diablo === 1) {
				
                pick = getTickCount();
				Town.goToTown(1);
				Pickit.pickItems();
				Town.move("portalspot");
				var sorc = getParty(this.taxi);
				while (sorc && sorc.area !== 1) {
					delay(250);
				}
				portal = Pather.getPortal(null, this.taxi);
				Pather.usePortal(null, null, portal); // Take portal to area
				Misc.scanShrines(15);  // find shrine
				Pather.usePortal(1, null); // Take portal home
				Pickit.pickItems();
				while (sorc && sorc.area !== 103) {
					delay(1000);
					if (sorc && sorc.area === 108) {
						break;
					}
				}
				Town.goToTown(4);
				
				Pather.usePortal(108, me.name);
				this.slayBoss(3060, 0, 30, Config.ClassicTeamCS.Diablo);
                while (getTickCount() - pick < 1500) {
                    Pickit.pickItems();
                    delay(me.ping + 100);
                }

                scriptBroadcast("quit");
            }

            if (!Pather.usePortal(103, null)) {
                Town.goToTown();
            }
        } else {
            Pather.moveTo(7767, 5263);
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

                if (postCount < preCount || !getParty(this.taxi)) {
                    break;
                }
            }

            maxTime += 3000;
            delay(3000);
        }

        scriptBroadcast("quit");
    };

    this.doPreattack = function () {
        var check, player;

        switch (me.classid) {
        case 0:
        case 1:
        case 2:
            if (me.getState(121)) {
                player = getUnit(0);
                if (player) {
                    Skill.cast(Config.AttackSkill[2], 0, player.x, player.y);
                }
            } else {
                Skill.cast(Config.AttackSkill[1], 0, me.x, me.y);
            }

            return true;
        case 3: // Paladin
            if (Config.AttackSkill[3] !== 112) {
                return false;
            }

            if (Config.AttackSkill[4] > 0) {
                Skill.setSkill(Config.AttackSkill[4], 0);
            }

            Skill.cast(Config.AttackSkill[3], 1);
            return true;
        case 4: // Barbarian 
            Skill.cast(Config.AttackSkill[3], 1);
            return true;
        case 5: // Druid
            if (Config.AttackSkill[3] === 245) {
                Skill.cast(Config.AttackSkill[3], 0, me.x, me.y);
                return true;
            }

            break;
        case 6: // Assassin
            if (Config.UseTraps) {
                check = ClassAttack.checkTraps({
                    x: me.x,
                    y: me.y
                });

                if (check) {
                    ClassAttack.placeTraps({
                        x: me.x,
                        y: me.y
                    }, 5);
                    return true;
                }
            }

            break;
        default:
            delay(2000);
            break;
        }

        return false;
    };

    this.slayBoss = function (classid, preattack, retry, stop) {
        var reposition,
            boss = false,
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
                this.doPreattack();
            } else {
                delay(500);
            }

            delay(me.ping + 10);
        }

        if (!boss) {
            print("no boss found");
            return;
        }

        if (!Config.ClassicTeamCS.Ranged) {
            this.teleWalk(boss.x + rand(-2, 2), boss.y + rand(0, 2), true);
        }

        time = getTickCount();
        reposition = false;

        while ((getTickCount() - time) < retry) {
            if (!Attack.checkMonster(boss)) {
                return;
            }

            if (!Config.ClassicTeamCS.Ranged && reposition) {
                reposition = false;
                this.teleWalk(boss.x + rand(-2, 2), boss.y + rand(0, 2), true);
            } else {
                if (classid !== 3060) {
                    Attack.deploy(me, 5, 5, 9);
                }
            }

            bosshp = parseInt((boss.hp * 100) / 128, 10);

            if (bosshp < stop) {
                return;
            }

            if (me.classid < 3) {
                this.doPreattack();
				Attack.clear(20, 0xF, false, false);
            }

            try {
				Attack.clear(20, 0xF, false, false);
                Attack.kill(boss);
            } catch (e) {}

            if (parseInt(((boss.hp * 100) / 128) + 5, 10) > bosshp) {
                reposition = true;
            }

            delay(me.ping + 10);
        }
    };

    if (me.area !== 103) {
        Pather.useWaypoint(103);
    }

    Town.doChores();
    Town.move("portalspot");
    var time = getTickCount();

    while (me.ingame) {
        delay(100);
        this.setTaxi();
        this.doNext();
		if (Config.ClassicTeamCS.BO && (!me.getState(32))) {
			return;
			
		}
        if (getTickCount() - time > 10000) {
            time = getTickCount();


        }
    }

    scriptBroadcast("quit");
}
