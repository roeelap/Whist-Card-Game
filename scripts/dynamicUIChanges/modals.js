export const updateLastTrick = (lastTrick) => {
  let output = '';
  for (const entry of lastTrick) {
    output += `
    <div class="modal-card-image">
      <h4 class="text-center">Player ${entry.player.index}</h4>
      <img src=${entry.card.getImage()}>
    </div>`;
  }

  $('#cardsModal .modal-body').html(output);
};