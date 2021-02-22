import { INSTRUCTIONS } from '../static/consts.js';

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

const updateInstructionButtons = (page) => {
  const previousBtn = $('#previous');
  const nextBtn = $('#next');

  if(page - 1 < 0) {
    previousBtn.attr('disabled', true);
  } else {
    previousBtn.attr('disabled', false);
  }
  
  if(page + 1 === INSTRUCTIONS.length) {
    nextBtn.attr('disabled', true);
  } else {
    nextBtn.attr('disabled', false);
  }
  
}

export const updateInstructionsPage = () => {
  const instructionsModal = document.querySelector('#instructionsModal');
  const page = parseInt(instructionsModal.dataset.page);
  $("#instructionsModal .modal-title").html(INSTRUCTIONS[page].title);
  $("#instructionsModal .modal-body").html(INSTRUCTIONS[page].body);
  updateInstructionButtons(page);
}

export const instructionsChangePage = (isNext) => {
  const instructionsModal = document.querySelector('#instructionsModal');
  const page = parseInt(instructionsModal.dataset.page);
  document.querySelector('#instructionsModal').dataset.page = isNext ? `${page + 1}` : `${page - 1}`
  updateInstructionsPage();
}