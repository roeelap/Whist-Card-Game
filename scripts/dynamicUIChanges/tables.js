import { SUITS_TO_ICONS } from '../static/consts.js';

const roundData = () => {
  let data = [game.round, game.roundMode, SUITS_TO_ICONS[game.trumpSuit]];

  for (const player of game.players) {
    const { bid, tricks, score } = player;
    data.push(bid, tricks, score);
  }
  return data;
};

const generateTablePrimaryHead = (table, headers) => {
  const tr = $('<tr>');
  for (const subject of headers) {
    $(tr).append($('<th rowspan="2">').append(subject));
  }
  $(table).append($('<thead>').append(tr));
};

const generateTableSecondaryHead = (thead, headers) => {
  const tr = $('<tr>');
  for (const subject of headers) {
    $(tr).append($('<th>').append(subject));
  }
  $(thead).append(tr);
};

const generateTablePlayersHead = (thead, playersList) => {
  const tr = $(thead).find('tr')[0];
  for (const player of playersList) {
    $(tr).append($('<th colspan="3">').append(player));
  }
  $(thead).append(tr);
};

export const createRoundHistoryTable = () => {
  const headers = ['Round', 'Over/Under', 'Trump'];
  const players = ['You', 'Player 2', 'Player 3', 'Player 4'];

  let playerHeaders = [];
  for (let i = 0; i < 4; i++) {
    playerHeaders.push(...['Bid', 'Tricks', 'Score']);
  }
  const roundHistoryTable = $('#roundHistoryTable')[0];
  $(roundHistoryTable).empty();
  generateTablePrimaryHead(roundHistoryTable, headers);
  const thead = $('#roundHistoryTable').find('thead')[0];
  generateTablePlayersHead(thead, players);
  generateTableSecondaryHead(thead, playerHeaders);
  const tbody = $('<tbody>');
  $(roundHistoryTable).append(tbody);
};

export const addRoundRow = () => {
  const data = roundData();
  const tbody = $('#roundHistoryTable').find('tbody')[0];
  const tr = $('<tr>');

  for (const value of data) {
    $(tr).append($('<td>').append(value));
  }

  if (game.round === 1) {
    $(tbody).html(tr);
  } else {
    $(tbody).append(tr);
  }
};
