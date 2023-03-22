/*jshint sub:true*/
/*jshint forin:false*/
var title = 'Rubber Factory';
var footer = 'Story, Scenario, and Code (c) 2016 Aelie';

// Helper consts
const BINDING_EASY = 1;
const BINDING_MEDIUM = 2;
const BINDING_HARD = 3;
const BINDING_EXTREME = 5;
const BINDING_IMPOSSIBLE = 8;
const BINDING_MAX = 10;

var gamestats = {
};

const LATEX_DESCRIPTION = "Latex grips the body tightly, forming a seamless, uniformly tight coat that's hard to fight against!";
var bindings = {
	'latexhead': {
		'name': 'Latex (Head)',
		'location': 'Head',
		'description': LATEX_DESCRIPTION,
		'easy': {'desc': "",
			'gagged': 1},
		'medium': {'desc': "",
			'gagged': 2},
		'hard': {'desc': "",
			'gagged': 3,
			'blinded': 1,
			'submissive': 1},
		'extreme': {'desc': "",
			'gagged': 4,
			'blinded': 2,
			'submissive': 2},
		'impossible': {'desc': "",
			'gagged': 4,
			'blinded': 4,
			'submissive': 4}
	},
	'latexarms': {
		'name': 'Latex (Arms)',
		'location': 'Arms',
		'description': LATEX_DESCRIPTION,
		'easy': {'desc': ""},
		'medium': {'desc': "",
			'bound': 1},
		'hard': {'desc': "",
			'bound': 2},
		'extreme': {'desc': "",
			'bound': 3},
		'impossible': {'desc': "",
			'bound': 4},
	},
	'latextorso': {
		'name': 'Latex (Torso)',
		'location': 'Torso',
		'description': LATEX_DESCRIPTION,
		'easy': {'desc': ""},
		'medium': {'desc': "",
			'breathless': 1,
			'vibrating': 1},
		'hard': {'desc': "",
			'breathless': 2,
			'vibrating': 2},
		'extreme': {'desc': "",
			'breathless': 3,
			'vibrating': 3},
		'impossible': {'desc': "",
			'breathless': 4,
			'vibrating': 4},
	},
	'latexlegs': {
		'name': 'Latex (Legs)',
		'location': 'Legs',
		'description': LATEX_DESCRIPTION,
		'easy': {'desc': ""},
		'medium': {'desc': "",
			'hobbled': 1},
		'hard': {'desc': "",
			'hobbled': 2},
		'extreme': {'desc': "",
			'hobbled': 3},
		'impossible': {'desc': "",
			'hobbled': 4},
	},
	'latextendrils': {
		'name': 'Latex Tendrils',
		'location': 'Tendrils',
		'description': LATEX_DESCRIPTION,
		'easy': {'desc': "",
			'immobilized': 1},
		'medium': {'desc': "",
			'immobilized': 1,
			'bound': 1},
		'hard': {'desc': "",
			'immobilized': 1,
			'bound': 2,
			'gagged': 1},
		'extreme': {'desc': "",
			'immobilized': 1,
			'bound': 3,
			'gagged': 2,
			'blinded': 1},
		'impossible': {'desc': "",
			'immobilized': 1,
			'bound': 4,
			'gagged': 3,
			'blinded': 2,
			'vibrating': 1},
	}
};

var enemytypes = {
	'latexorb': {
		'name': 'Latex Orb',
		'description': "A floating ball of latex, created to react to intruders as the factory's first line of defense.<br><br>" +
						"<b>Reaction: Sound-Seeker</b><br>" +
						"When an opponent casts a spell, the latex orb will attempt to intterupt it, rolling an attack at -3. If successful, 1 level of latex bondage is applied to the caster's head and the spell is cancelled.<br>" +
						"May only be used once per turn, and only one latex orb may attempt to interrupt a given spell cast.<br><br>" +
						"<b>Reaction: Expendable</b><br>" +
						"The latex orb is not designed to persist for a very long time, and therefore loses 1 HP automatically at the end of its turn.<br>" +
						"In order to maximize its usefulness, when low on HP (1 or 2) at the start of its turn, it will use Latex Explosion, prioritizing the last player to damage it (if any).<br>" +
						"Similarly, if a physical attack leaves a latex orb with just 1 or 2 HP, it will respond by exploding <b>immediately</b>, targeting the attacker.<br><br>",
		'hp': 5,
		'defense': 10,
		'setupcustom': latex_orb_setup,
		'damagecustom': latex_orb_damage,
		'reactcustom': latex_orb_react,
		'ai': latex_orb_ai,
		'attacks': {
			'latexspray': {
				'name': 'Latex Spray',
				'descripion': "Sprays a single ranged target with a thin coating of latex in any location.",
				'targets': 'single',
				'effects': [{'roll': 13, 'damage': 1}, {'roll': 20, 'damage': 2}],
				'effectstypes': ['latexhead', 'latexarms', 'latextorso', 'latexlegs']
			},
			'latexexplosion': {
				'name': 'Latex Explosion',
				'description': "The orb explodes, sacrificing itself in an attempt to cover a single melee target in latex!<br>The latex is distributed fairly evenly, making this attack quite dangerous if the target already has some latex bondage!",
				'targets': 'single',
				'custom': latex_orb_explosion
			},
			'spellward': {
				'name': 'Spell Ward',
				'description': "Creates an anti-magic ward. The next time the orb attempts to interrupt a hostile spell with Sound-Seeker, it will roll at +3 instead of -3.",
				'targets': 'self',
				'custom': latex_orb_spellward
			}
		}
	}
};

var extraactions = {
};

var intro = [{
	'story': [
		"<center><font size='+3'>Bondage Quest: Rubber Factory!</font></center>"
	],
}];

var fights = {
	'force_fight': {
		'name': 'Brute Force!',
		'next': 'start',
		'fail': 'start',
		'reward': 0,
		'start': function() {
			addPlayer('Lia', 'magical_girl');
			addPlayer('Reika', 'elementalist');
			addPlayer('Erin', 'valkyrie');
			addEnemy('latexorb');
			addEnemy('latexorb');
			addEnemy('latexorb');
		}
	}
};

var states = {
	'start':{
		'title':'In Town',
		'map': 'images/town.png',
		'map-items': [],
		'story': [ "A mysterious factory for \"Rubber Processing\" has begun operation, and people have been disappearing, along with an uptick in Rubberslave trade activity.",
					"Your group has been assembled to investigate what's going on in there, and even shut it down if need be!",
					"As you approach the factory, it dawns on you that you won't exactly be welcomed with open arms. There are several courses of action you could take from here:<br>" +
					"- You could rely on <b>Brute Force</b>, but you will encounter the most opposition and put the factory on full alert.<br>" +
					"- You could <b>Hop the Fence</b>, although you'll still have to avoid hidden traps and roving patrols on the other side.<br>" +
					"- You could <b>Disguise Yourselves</b> as guards to sneak in, at risk of being caught in a compromising situation if you are found out.<br>" +
					"- Finally, you could try to infiltrate through the <b>Latex Sewers</b>, which is exactly as dangerous as it sounds, but stands no chance of alerting anyone."
				],
		'decisions': [
			{'decision': 'Brute Force', 'result': {'move_to': 'force1'}},
			{'decision': 'Hop the Fence (INCOMPLETE)', 'result': {'move_to': 'fence1'}},
			{'decision': 'Disguise Yourselves (INCOMPLETE)', 'result': {'move_to': 'disguise1'}},
			{'decision': 'Latex Sewers (INCOMPLETE)', 'result': {'move_to': 'sewers1'}}
		],
		'actions': []
	},
	'force1': {
		'title': 'Factory Front Gate',
		'map': 'images/town.png',
		'map-items': [],
		'fight': 'force_fight',
		'story': ["As expected, you are immediately met with resistance at the front gates, and the alarm starts blaring as well! Better get this fight wrapped up quickly before backup arrives"],
		'decisions': [],
		'actions': []
	}
};

var bad_ends = {
};

var good_ends = [];

// BEGIN GAME-SPECIFIC FUNCTIONS

function latex_orb_setup(enemy) {
	enemyBuff(enemy, 'expendable', {
		'name': 'Expendable',
		'custom': latex_orb_expendable,
		'hidden': true
	});
}

function latex_orb_expendable() {
	for (const e in enemies) {
		if (turnorder[currentturn]['name'] !== e) continue;
		sendEvent('The latex orb decays, losing 1 HP...<br>', false);
		damageEnemy(e, 1);
		const hp = enemies[e]['hp'];
		if (hp > 0 && hp < 3) sendEvent('<span style="color: red;">It is planning on using Latex Explosion on its next turn!</span><br>', true);
	}
}

function latex_orb_damage(enemy, damage) {
	if (turnorder[currentturn]['type'] !== 'player') return false;
	const player_name = turnorder[currentturn]['name'];
	// this enemy buff keeps track of the last player to damage the orb
	enemyBuff(enemy, 'revenge', {
		'name': 'Last Damaged by ' + player_name,
		'player': player_name,
		'hidden': true
	});
	// this player buff keeps tracks of which player is currently attack the orb (lasts only for the turn in which it is created)
	if (classes[players[current_player]['class']]['attacks'][targets_picked[0]]['type'] === 'physical') {
		addBuff(current_player, 'melee' + enemy, {
			'name': 'Physical Attacker',
			'duration': 1,
			'enemy': enemy,
			'custom': latex_orb_physical_react,
			'hidden': true
		});
	}
	return false;
}

function latex_orb_physical_react() {
	for (const e in enemies) {
		if (hasBuff(current_player, 'melee' + e) && enemies[e]['hp'] < 3) {
			sendEvent('<span style="color: red;">The volatile latex orb EXPLODES as a result of the physical attack!</span><br>', true);
			latex_orb_explosion(e, current_player);
		}
	}
}

function latex_orb_react(player, attack, enemy, targets_picked) {

	// each attack can only be reacted to by one orb
	if (hasBuff(player, 'soundseekerCD')) return false;
	// each orb can only react once per turn
	if ('soundseekerCD' in enemies[enemy]['buffs']) return false;
	// only react to spells
	if (!('type' in attack) || attack['type'] !== 'spell') return false;

	// implement the reaction cooldowns as buffs
	enemyBuff(enemy, 'soundseekerCD', {'name': 'Sound-Seeker Cooldown', 'duration': 1, 'hidden': true});
	addBuff(player, 'soundseekerCD', {'name': 'Sound-Seeker Target Cooldown', 'duration': 1, 'hidden': true});

	// add spellward bonus
	var modifier = -3;
	if (enemyHasBuff(enemy, 'spellward')) {
		removeEnemyBuff(enemy, 'spellward');
		modifier += 6;
	}

	sendEvent('<span style="color: red;"><b>The latex orb reacts to a spell being cast</b></span>, casting Latex Spray at ' + players[player]['name'] + '...', false);
	const roll = diceRoll({'base': enemies[enemy]['stats']['hit'] + modifier, 'd20': 1}, 'Sound-Seeker [Hit]', false);

	if (roll < players[player]['stats']['defense']) {
		sendEvent(' but misses!<br>', false);
		return false;
	}

	sendEvent(' and hits, applying 1 Latex (Head) bondage level and interrupting the spell!<br>', true);
	adjustItem(player, 'latexhead', 1);

	nextTurn();
	return true;
}

function latex_orb_ai(enemy) {
	const attacks = enemytypes["latexorb"]["attacks"];
	// select target
	var target;
	if (enemyHasBuff(enemy, 'revenge')) {
		const player = enemies[enemy]['buffs']['revenge']['player'];
		target = player;
	}
	else {
		var targets = [];
		for (const p in players) {
			if (players[p]['stats']['incapacitated'] == 0) targets.push(p);
		}
		if (targets.length === 0) return;
		target = targets[Math.floor(Math.random() * targets.length)];
	}
	// select attack
	var attack;
	if (enemies[enemy]['hp'] < 3) {
		sendEvent('The latex orb flies over to ' + players[target]['name'] + ' and explodes!<br>', true);
		attack = attacks['latexexplosion'];
	}
	else if (!('spellward' in enemies[enemy]['buffs']) && Math.random() < 0.25) {
		attack = attacks['spellward'];
	}
	else {
		attack = attacks['latexspray'];
	}
	// execute
	enemyAttack(enemy, target, attack);
}

function latex_orb_explosion(enemy, target) {

	const target_name = players[target]['name'];
	const target_stats = players[target]['stats'];
	const enemy_stats = enemies[enemy]['stats'];
	const enemy_hp = enemies[enemy]['hp'];

	// +1 to hit and effect for each HP above 2
	const bonus_from_hp = Math.max(enemy_hp - 2, 0);

	const hit_roll = diceRoll({'base': enemy_stats['hit'] + bonus_from_hp, 'd20': 1}, 'Latex Explosion [Hit]', false);
	const crit = critical;

	if (hit_roll < target_stats['defense']) {
		sendEvent(target_name + ' manages to avoid the blast!<br>', true);
		damageEnemy(enemy, enemies[enemy]['hp']);
		return true;
	}

	const effect_roll = diceRoll({'base': enemy_stats['effect'] + target_stats['enemyeffect'] + bonus_from_hp, 'd20': 1}, 'Latex Explosion [Effect]', false);

	var binding_list;
	var effect_levels;
	var message;
	if (effect_roll <= 8) {
		binding_list = ['latexarms', 'latextorso', 'latexlegs'];
		effect_levels = 6;
		message = target_name + ' hits the deck, keeping her head covered, but still gaining <span style="color: red;">6</span> total bondage levels!<br>', true;
	}
	else if (effect_roll <= 15) {
		binding_list = ['latexhead', 'latexarms', 'latextorso', 'latexlegs'];
		effect_levels = 8;
		message = target_name + ' is caught in the blast, gaining <span style="color: red;">8</span> total bondage levels!<br>', true;
	}
	else if (effect_roll <= 19) {
		binding_list = ['latexhead', 'latexarms', 'latextorso', 'latexlegs'];
		effect_levels = 10;
		message = target_name + ' suffers a direct hit, gaining <span style="color: red;">10</span> total bondage levels!<br>', true;
	}
	else {
		binding_list = ['latexhead', 'latexarms', 'latextorso', 'latexlegs'];
		effect_levels = 12;
		message = target_name + ' suffers a direct hit, and catches most of the splash coming back down, gaining <span style="color: red;">12</span> total bondage levels in a nice, even coat!<br>', true;
	}

	sendEvent(message, true);

	// apply effect levels as evenly as possible
	while (effect_levels > 0) {
		var lowest_level = 99;
		var lowest_binding = 'latexlegs'; // dummy value just in case
		for (const b of binding_list) {
			const level = getItemLevel(target, b);
			if (level < lowest_level) {
				// in case of ties, current logic will start at the head then work down
				lowest_level = level;
				lowest_binding = b;
			}
		}
		adjustItem(target, lowest_binding, 1);
		effect_levels--;
	}

	if (crit) {
		sendEvent('<span style="color: red;">CRIT! The latex orb is able to fully reassemble from the gooey blast!</span><br>', true);
		// heal enemy to 5
		damageEnemy(enemy, enemy_hp - 5);
	}
	else {
		// kill enemy
		damageEnemy(enemy, enemy_hp);
	}

	return true;
}

function latex_orb_spellward(enemy, target) {
	sendEvent('The latex orb creates an anti-magic ward, greatly improving its next attempt to interupt a spell!<br>', true);
	enemyBuff(enemy, 'spellward', {'name': '<span style="color: red;">Spell Ward</span>'});
	return true;
}