if (board.classList.contains(boardSwimlanesActiveClass)) {
  board.classList.remove(boardSwimlanesActiveClass);
  chrome.storage.sync.set({'isInactive': true});
} else {
  board.classList.add(boardSwimlanesActiveClass);
  chrome.storage.sync.set({'isInactive': false});
}
