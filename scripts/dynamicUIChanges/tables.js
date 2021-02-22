// export const reRenderTables = (game) => {
//   createRoundInfoTable(game);
//   createScoreTable(game);
// };

// const createRoundInfoTable = (game) => {
//   const data = [
//     { id: 'roundNumber', text: `Round ${game.round} of 14` },
//     { id: 'trumpSuit', text: `Trump Suit: ${SUITS_TO_ICONS[game.trumpSuit]}` },
//     { id: 'totalBids', text: `Total Bids: ${game.totalBids}` },
//     { id: 'roundMode', text: game.getRoundMode() },
//   ];

//   let table = $('<table></table>').addClass('table table-sm table-hover').html(`
//   <thead>
//     <tr class="text-center">
//       <th>
//         <strong>Round Information</strong>
//       </th>
//     </tr>
//   </thead>`);

//   let tableBody = $('<tbody></tbody>');

//   for (let row of data) {
//     tableBody.append(`
//     <tr id="${row.id}">
//       <td>${row.text}</td>
//     </tr>`);
//   }
//   table.append(tableBody);
//   $('#roundInfo').html(table);
// };

// const createScoreTable = (game) => {
//   let data = [];
//   for (let player of game.players) {
//     const { index, bid, tricks, score } = player;
//     data.push({ id: `player${index}info`, player: `Player ${index}`, bid, tricks, score });
//   }

//   let table = $('<table></table>').addClass('table table-sm table-hover text-center').html(`
//   <thead>
//     <tr>
//       <th>Player</th>
//       <th>Bid</th>
//       <th>Tricks</th>
//       <th>Score</th>
//     </tr>
//   </thead>`);

//   let tableBody = $('<tbody></tbody>');

//   for (let row of data) {
//     const { id, player, bid, tricks, score } = row;
//     tableBody.append(`
//     <tr id="${id}">
//       <td>${player}</td>
//       <td>${bid}</td>
//       <td>${tricks}</td>
//       <td>${score}</td>
//     </tr>`);
//   }
//   table.append(tableBody);
//   $('#score').html(table);
// };
