export const showSuitButtons = (isShow) => {
  if (isShow) {
    return $('#suit-bid').show();
  }
  $('#suit-bid').hide();
};

export const showBidButtons = (isShow) => {
  if (isShow) {
    return $('#tricks-bid').show();
  }
  $('#tricks-bid').hide();
};

export const showLastTrickButton = (isShow) => {
  if (isShow) {
    return $('#last-trick-btn').show();
  }
  $('#last-trick-btn').hide();
};

export const createTrickBidButtons = (minBid, forbiddenBid) => {
  let newDiv = $('<div class="trick-buttons"></div');
  for (let i = 0; i <= 13; i++) {
    const disabled = i < minBid || i === forbiddenBid ? 'disabled' : '';
    newDiv.append(
      `<input type="button" class="btn btn-primary bidButton" value="${i}" onclick="onTricksBidButtonClicked(this)" ${disabled}/>`
    );
  }
  $('#tricks-bid').html(newDiv);
};

export const increaseBid = () => {
  if ($('#bidAmount')[0].value < 13) {
    $('#bidAmount')[0].value++;
  }
};

export const decreaseBid = () => {
  if ($('#bidAmount')[0].value > 5) {
    $('#bidAmount')[0].value--;
  }
};
