let readlineSync = require('readline-sync');

let monsterAttack 
let heroAttack

function diceRoll(num){
    return Math.floor(Math.random()*num)+1
}

function diceRollArray(num){
    return Math.floor(Math.random()*num)
}

function initializeValues(){
 dwarfFighter.hp = 35
 dwarfFighter.carriedTreasure = ['Battle Axe']
 elfRanger.hp = 25
 elfRanger.carriedTreasure =  [`Long Bow`]
 humanWizard.hp = 20
 humanWizard.carriedTreasure = ['Staff']
 halflingRogue.hp = 22
 halflingRogue.carriedTreasure =  ['Dagger']   
 activeMonster.hp = resetHP
}

function combat(){
     activeHero = currentHero
     activeMonster = currentRoom.roomMonster
     resetHP = currentRoom.roomMonster.hp
    // activeMonster = dummy

    console.log(`\nThe ${activeHero.name} is battling the ${activeMonster.name}!`)
    combatSequence()
}
function combatSequence() {
    let heroWon
    while (activeHero.hp > 0 && activeMonster.hp > 0) {
        heroAttack = diceRoll(20) + activeHero.hitBonus
        monsterAttack = diceRoll(20) + activeMonster.hitBonus
        console.log(`\n${activeHero.name} rolled a total attack roll of ${heroAttack}`)
        if (heroAttack >= activeMonster.ac) {
            console.log (`\n${activeHero.attackDescription} ${activeMonster.name}, you deal ${activeHero.damage} damage to it.`)
            activeMonster.hp = activeMonster.hp - activeHero.damage
            checkCombatState()
        } else {
            console.log(`\n${activeHero.attackMiss} ${activeMonster.name}!`)
            checkCombatState()
        }
    }
}

function checkCombatState() {
    if (activeMonster.hp <= 0){
        console.log(`\nYou have slain the ${activeMonster.name}!\nYou search the room and find...${currentHero.treasureTable[dungeonMap.indexOf(currentRoom)]}. Thanks to the item's magic, you feel stronger!\n`)
        currentHero.carriedTreasure.push(currentHero.treasureTable[dungeonMap.indexOf(currentRoom)])
        console.log (`Current Inventory: ` + currentHero.carriedTreasure.join(", ") + "\n")
        switch(dungeonMap.indexOf(currentRoom)){
            case 0 : console.log("The potion you found may save your life in the near future...\n")
            break
            case 1 : currentHero.hitBonus += 3; console.log(`Your bonus to hit has gone up by 3! Your Hit Bonus is now: ${currentHero.hitBonus}\n`)
            break
            case 2 : currentHero.ac += 3; console.log(`Your AC has gone up by 3! Your AC is now: ${currentHero.ac}\n`)
            break
            case 3 : currentHero.damage += 3; console.log(`Your Damage has gone up by 3! Your damage is now: ${currentHero.damage}\n`)
        }
        heroWon = true
        activeMonster.hp = resetHP
        endCombat() 
    }else {
    console.log(`\nThe ${activeMonster.name} rolled a total attack roll of ${monsterAttack}.`)
    if(monsterAttack >= activeHero.ac) {
        console.log (`\nThe ${activeMonster.name} hits you, you suffer ${activeMonster.damage} points of damage`)
        activeHero.hp = activeHero.hp - activeMonster.damage
        console.log(`\nYou have ${activeHero.hp} HP remaining.`)
            if (activeHero.hp <= activeHero.startingHp/2 && activeHero.carriedTreasure[1] === 'Healing Potion'){
                activeHero.hp = activeHero.hp + 10
                currentHero.carriedTreasure.splice(1,1)
                console.log(`\nYou quickly drink the Healing Potion to recover from your wounds! Your current HP: ${activeHero.hp}`)
            } else if(activeHero.hp <= 0){
                    console.log(`\nYour hero has been killed, no one will remember your deeds now...`)
                    heroWon = false
                    endCombat()
                    process.exit()
                }
        } else { 
            console.log(`\nThe ${activeMonster.name}'s attack misses you!`)
        }
    }
}

function endCombat(){
    currentHero.hp = activeHero.hp
    if (heroWon === true && currentRoom === roomTreasure){
        console.log (`You have found the fabled treasure you seek, ${currentHero.treasureTable[4]}! You heroic deeds will be remembered through time!\n Try playing again with a new character!\n`)
        startGame()
        // initializeValues()
    }else if (heroWon){
    console.log(`You have survived...for now. Will you proceed deeper into the dungeon?`)
    let afterWin = ["Delve deeper into the darkness...", "Stay put for now..."]
    let afterChoice = readlineSync.keyInSelect(afterWin, null, {cancel : 'A choice is required...'})
    if (afterChoice === 0){
        loadRoom(dungeonMap.indexOf(currentRoom)+1)
        } else if (afterChoice === 1){
            if (currentHero.hp <= currentHero.startingHp-5){
                console.log(`\n${currentRoom.returnDescription} After resting you muster up the coruage to venture deeper into the dungeon.`)
                currentHero.hp = currentHero.hp + 5
                console.log (`You quickly tend to your wounds, current HP: ${currentHero.hp}`)
                loadRoom(dungeonMap.indexOf(currentRoom)+1)
            } else {
                console.log("There is no time to waste! Make haste further into the dungeon to find your prize!")
                loadRoom(dungeonMap.indexOf(currentRoom)+1)
            }
        } else {
            console.log("\nA choice is required...\n")
            endCombat()
        } } else if (heroWon === false) {
    console.log(`\nGAME OVER. Better luck next time!\n`)
    process.exit()
}
}
// PLAYER CHARACTER DATA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function playerCharacter(name, hp, ac, hitBonus, damage, carriedTreasure, treasureTable, attackDescription, attackMiss, startingHp){
    this.name = name,
    this.hp = hp,
    this.ac = ac,
    this.hitBonus = hitBonus,
    this.damage = damage,
    this.carriedTreasure = [carriedTreasure]
    this.treasureTable = treasureTable
    this.attackDescription = attackDescription
    this.attackMiss = attackMiss
    this.startingHp = startingHp
}

let dwarfFighter = new playerCharacter('Dwarf Fighter', 35, 16, 5, 5, 'Battle Axe',[`Healing Potion`, `Lordly Battle Axe`, `Ancient Dwarven Shield`, `Gauntlets of Strength`, `The Book of Grudges`], 'Your axe cleaves into the', 'You swing your axe wildly and miss the', 35)
let elfRanger = new playerCharacter('Elf Ranger', 25, 15, 6, 8, 'Long Bow', ['Healing Potion', "Elven Bow", "Elven Chainmail", 'Arrows of Slaying', 'Shard of the Silmaril' ], "Your arrow lands true, embedding itself into the", 'Your arrow strays off course and misses the', 25)
let humanWizard = new playerCharacter('Human Wizard', 20, 14, 5, 10, "Staff", ['Healing Potion', "Magus Staff", "Robe of Protection", 'Ring of Spellpower', 'The Necronomicon'], 'Your mighty spell blasts the', 'Your spell fizzles and fails to effect the', 20)
let halflingRogue = new playerCharacter('Halfling Rogue', 22, 15, 6, 8, "Dagger", ['Healing Potion', 'Elven Shortsword', 'Mithril Chain Shirt', `Sam's Frying Pan`, ' Curious ring...'], "Your weapon finds it mark in the", 'You fumble your attack, missing the', 22)

let heroes = [dwarfFighter, elfRanger, humanWizard, halflingRogue]
let heroSelection = [dwarfFighter.name, elfRanger.name, humanWizard.name, halflingRogue.name,]
let currentHero

// MONSTER DATA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function monster(name, hp, ac, hitBonus, damage, challangeTier, description){
    this.name = name,
    this.hp = hp,
    this.ac = ac,
    this.hitBonus = hitBonus,
    this.damage = damage,
    this.challangeTier = challangeTier,
    this.description = description
}

let skeleton = new monster('Skeleton', 6, 14, 3, 4, 1, "A magically animated humanoid skeleton holding a rusty, broken sword." )
let orc = new monster("Orc", 10, 13, 4, 5, 1, " A hulking green humanoid with pig-like features wielding a wicked axe.")
let direRat = new monster("Dire Rat", 5, 11, 2, 4, 1, "A giant, ravenous rat.")
let bugbear = new monster("Bugbear", 19, 14, 4, 6, 2, "A brutish hairy goblinoid wield a viscious mace.")
let ghoul = new monster("Ghoul", 21, 12, 4, 7, 2, "A shambling human corpse that hungers for the flesh of the living.")
let owlBear = new monster("Owlbear", 25, 11, 5, 7, 2, "A ferocious bear-like animal with the head of an owl.")
let necromancer = new monster("Necromancer", 30, 12, 6, 10, 3, "An evil wizard clad in black robes, the scent of death lingers about him.")
let dragon = new monster("Baby Dragon", 35, 14, 5, 9, 3, "A small red dragon, lucky for you it is not very old.")

let tierOneMonster = [skeleton, orc, direRat]
let tierTwoMonster = [bugbear, ghoul, owlBear]
let tierThreeMonster = [necromancer, dragon]

// ROOM DATA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function dungeonRoom(name, description, returnDescription, monster){
    this.roomName = name,
    this.roomMonster = monster,
    this.roomDescription = description,
    this.returnDescription = returnDescription
}

let roomEntrance = new dungeonRoom(`Dilapidated Entryway`, `After crossing the dungeon entrance you find yourself in a ruined entryway. Tattered banners and broken, moss covered pillars litter the dimly torch lit area`,`You rest in the Dilapidated Entryway. You find little comfort in the erie quiet.`,tierOneMonster[diceRollArray(3)])
let roomBarracks = new dungeonRoom(`Abandoned Barracks`, `This room appears to be an abandoned barracks. Remenants of the previous inhabitants are strewn about, there is nothing useful at first glance...`, `You find reprieve in the Abandoned Barracks, you rest on an empty bed to regather your thoughts...`,tierOneMonster[diceRollArray(3)])
let roomLibrary = new dungeonRoom(`Musty Library`, `This room appears to be an old research library. There are books stacked to the cieling, the room smells of musty old paper.`, `You collect your thoughts in the Moldy Library, you pick up a book to read it but the words are nonsensible.`, tierTwoMonster[diceRollArray(3)])
let roomLab = new dungeonRoom(`Alchemy Lab`, `This room is a wizard's laboratory. There are alchemical tubes and tools on a busy desk and strange, arcane relics hum with a mysterious power.`, `You try to rest in the Alchemy Lab, it would probably be wise not to drink the mysterious potions. Your quest is almost over...`, tierTwoMonster[diceRollArray(3)])
let roomTreasure = new dungeonRoom(`The Treasure Room`, `This is the fabeled treasure room. Wonderous treasures have been collected here over time. What you seek must be in this room!`,`This probably shouldnt be happening! This is most likely a bug!`, tierThreeMonster[diceRollArray(2)])

let dungeonMap = [roomEntrance, roomBarracks, roomLibrary, roomLab, roomTreasure]
let currentRoom

// GAME FUNCTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function heroIntro(){
 let tittle = String.raw`        ___             __   ___   __  ___     __          ___   __  __         __  __  
       /   \ /\ /\   /\ \ \ / _ \ /__\/___\ /\ \ \        /   \ /__\/ //\   /\ /__\/__\ 
      / /\ // / \ \ /  \/ // /_\//_\ //  ///  \/ /_____  / /\ //_\ / / \ \ / //_\ / \// 
     / /_// \ \_/ // /\  // /_\\//__/ \_/// /\  /|_____|/ /_////__/ /___\ V ///__/ _  \ 
    /___,'   \___/ \_\ \/ \____/\__/\___/ \_\ \/       /___,' \__/\____/ \_/ \__/\/ \_/ `
    console.log(tittle)
    console.log("\nWelcome to the dungeon...\nWhich hero dares to enter?")
    let selectHero = readlineSync.keyInSelect(heroSelection, null,
        {cancel : 'Exit Game'})
        if (selectHero != -1 ){currentHero = heroes[selectHero]
    console.log(`\nThe fearless ${heroSelection[selectHero]} enters the dungeon.\nCharacter Stats: HP:${currentHero.hp} | Armor Class: ${currentHero.ac} | Hit Bonus: ${currentHero.hitBonus} | Damage: ${currentHero.damage} | Starting Treasure: ${currentHero.carriedTreasure}\n`)
            loadRoom(0)
        } else {console.log(`\nThanks for playing Dungeon Delver! Please try it again. gitHub user: Limlight86\n`)
            process.exit()      
    }
}

function loadRoom(index){
    currentRoom = dungeonMap[index]
    console.log (`\nYou proceed onwards, deeper into the dungeon... \n${currentRoom.roomDescription}\n`)
    console.log(`Suddenly, leaping from the shadows, attacks...${currentRoom.roomMonster.description} Prepare for battle!\n`)
    console.log("What will you do?")
    let roomOptions = ['Fight!', "Run for your life!"]
    let roomOption = readlineSync.keyInSelect(roomOptions, null, {cancel : 'Exit Game'})
    if (roomOption === 1){
        console.log("\nYou run away from the dungeon with your tail between your legs. Return when you are skilled and brave enough!\n")
        console.log(`GAME OVER. Better luck next time!\n`)
        process.exit()
    }else if (roomOption === 0){
        combat()
}else {
    console.log(`\nThanks for playing Dungeon Delver! Please try it again. gitHub user: Limlight86\n`)
    process.exit()
}}

function startGame(){
heroIntro()
}

startGame()