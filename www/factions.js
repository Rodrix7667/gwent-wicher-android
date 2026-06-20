"use strict"

var factions = {
	realms: {
		name: "Reinos del Norte",
		factionAbility: player => game.roundStart.push( async () => {
			if (game.roundCount > 1 && game.roundHistory[game.roundCount-2].winner === player) {
				player.deck.draw(player.hand);
				await ui.notification("north", 1200);
			}
			return false;
		}),
		description: "Roba una carta de tu mazo cada vez que ganas una ronda."
	},
	nilfgaard: {
		name: "Imperio de Nilfgaard",
		description: "Gana cualquier ronda que termine en empate."
	},
	monsters: {
		name: "Monstruos",
		factionAbility: player => game.roundEnd.push(() => {
			const units = board.row.filter( (r,i) => player === player_me ^ i < 3)
				.reduce((a,r) => r.cards.filter(c => c.isUnit()).concat(a), []);
			if (units.length === 0)
				return;
			const card = units[randomInt(units.length)];
			card.noRemove = true;
			game.roundStart.push( async () => {
				await ui.notification("monsters", 1200);
				delete card.noRemove;
				return true; 
			});
			return false;
		}),
		description: "Mantiene una carta de Unidad aleatoria después de cada ronda."
	},
	scoiatael: {
		name: "Scoia'tael",
		factionAbility: player => game.gameStart.push( async () => {
			let notif = "";
			if (player === player_me) {
				await ui.popup("Ir Primero", () => game.firstPlayer = player, "Dejar que Empiece el Oponente", () => game.firstPlayer = player.opponent(), "¿Te gustaría ir primero?", "La ventaja de la facción Scoia'tael te permite decidir quién va primero.", 0.55);
				notif = game.firstPlayer.tag + "-first";
			} else if (player.hand instanceof HandAI) {
				if (Math.random() < 0.5) {
					game.firstPlayer = player;
					notif = "scoiatael";
				} else {
					game.firstPlayer = player.opponent();
					notif = game.firstPlayer.tag + "-first";
				}
			} else {
				//sleepUntil(game.firstPlayer); //TODO online
			}
			await ui.notification(notif,1200);
			return true;
		}),
		description: "Decide quién toma el primer turno."
	},
	skellige: {
		name: "Skellige",
		factionAbility: player => game.roundStart.push( async () => {
			if (game.roundCount != 3)
				return false;
			const currPlayer = game.currPlayer;
			game.currPlayer = player;
			await ui.notification("skellige-" + player.tag, 1200);
			if (player.controller instanceof ControllerAI)
			{
				await Promise.all(player.grave.findCardsRandom(c => c.isUnit(), 2).map(c => board.toRow(c, player.grave)));
			}
			else
			{
				await factions['skellige'].helper(player);
				await factions['skellige'].helper(player);
			}
			game.currPlayer = currPlayer;
			return true;
		}),
		helper: async player => {
			const units = player.grave.findCardsRandom(c => c.isUnit(), 1);
			if (units.length === 0)
				return;
			const card = units[0];
			if (card.row === 'agile')
			{
				const selectedRow = await ui.waitForRowSelection(card);
				if (selectedRow)
				{
					await board.moveTo(card, selectedRow, player.grave);
				}
			}
			else
			{
				await board.toRow(card, player.grave);
			}
		},
		description: "2 cartas aleatorias del cementerio se colocan en el campo al inicio de la tercera ronda."
	}
}
