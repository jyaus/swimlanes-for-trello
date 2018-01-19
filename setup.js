var cssFile = chrome.extension.getURL('css/trello-swimlanes.css'),
  board = document.getElementById('board'),
  laneIndicator = '\ud83c\udfca';
  alternativeLaneIndicator = '|';
  boardSwimlanesActiveClass = 'swimlanes';

function insertCss() {
  if (document.getElementById('swimlanescss') === null) {
    var css = document.createElement('link');
    css.id = 'swimlanescss';
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = cssFile;
    document.getElementsByTagName('head')[0].appendChild(css);
  }
}

var swimlanesExist = false;

function findSwimlanes() {
    var headerNames = document.querySelectorAll('.list-wrapper .list-header-name');
    
    for (let headerName of headerNames)
    {  
        var headerNameValue = headerName.value;
        var closestListWrapper = headerName.closest('.list-wrapper');
        
        if ((headerNameValue.indexOf(laneIndicator) > -1) || (headerNameValue.indexOf(alternativeLaneIndicator) > -1))
        {
            swimlanesExist = true;
            if (closestListWrapper) 
            {
                closestListWrapper.classList.add('swimlane-start');
                var laneTitle = ' '; 
                if (headerNameValue.indexOf(laneIndicator) > -1)
                {
                    laneTitle = headerNameValue.substr(headerNameValue.indexOf(laneIndicator)).replace(laneIndicator,'');
                }
                if (headerNameValue.indexOf(alternativeLaneIndicator) > -1)
                {
                    laneTitle = headerNameValue.substr(headerNameValue.indexOf(alternativeLaneIndicator)).replace(alternativeLaneIndicator,'');
                }
                
                closestListWrapper.setAttribute('data-swimlane-title', laneTitle);
                
                if (closestListWrapper.previousSibling && !(closestListWrapper.previousSibling.classList.contains('swimlane-break'))) {
                    var swimlaneBreak = document.createElement('div');
                    swimlaneBreak.classList.add('swimlane-break');
                    closestListWrapper.parentNode.insertBefore(swimlaneBreak, closestListWrapper);
                }
            }
        } else {
            if (closestListWrapper) 
            {
                closestListWrapper.classList.remove('swimlane-start');
                if (closestListWrapper.previousSibling && (closestListWrapper.previousSibling.classList.contains('swimlane-break'))) {
                    closestListWrapper.previousSibling.remove();
                }
                
            }
        }
    }
    
    if (swimlanesExist)
    {
        insertCss();
        for (var header of headerNames) {
          header.addEventListener('change',findSwimlanes,false);
        }        
    }
}
findSwimlanes();

chrome.storage.sync.get('isInactive', function (result) {
      try {
          if (result.isInactive) {
            board.classList.remove(boardSwimlanesActiveClass);
          } else  {
            board.classList.add(boardSwimlanesActiveClass);
          } 
      } catch (e) {
          board.classList.add(boardSwimlanesActiveClass);
      }
});

