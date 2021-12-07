let storageType = 'sync';

const HelperWASD = {
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  },
  getSettings() {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined') {
        chrome.storage[storageType].get((items) => {
          resolve(items);
        });
      } else {
        reject('browser not supported?');
      }
    });
  },
  showMessage(message, type = 'success') {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    let status = document.querySelector('#status')
    let textElement = status.querySelector('p');
    textElement.innerHTML = message;
    textElement.classList.remove(...textElement.classList);
    textElement.classList.add(type);
    status.classList.add('active');
    let hide = () => {
      status.removeEventListener('click', hide);
      status.classList.remove('active');
      this.messageTimeout = null;
    };
    status.addEventListener('click', hide);
    this.messageTimeout = setTimeout(hide, 2000);
  },
}

// backup
document.querySelector('.backup-upload').addEventListener('click', () => {
  document.querySelector('#importInput').click()
});

document.querySelector('input#importInput').onchange = (() => {
  let files = document.querySelector('input#importInput').files[0]
  var reader = new FileReader()
  reader.onload = processFile(files)
  if (files.name.indexOf('.backup') == files.name.length - 7 || files.name.indexOf('.backup.txt') == files.name.length - 11) {
    reader.readAsText(files)
  } else {
    HelperWASD.showMessage(`только .backup файлы`, 'error');
  }
})

 processFile = (theFile) => {
  return (e) => {
    let setting = JSON.parse(e.target.result)
    chrome.storage[storageType].set(setting, () => {
      window.close()
    })
  }
}


backupDropContainer.ondragenter = (e) => {
  e.preventDefault();
};
backupDropContainer.ondragover = (e) => {
  e.preventDefault();
  backupDropContainer.classList.add('dragover');
}
backupDropContainer.ondragleave = (e) => {
  e.preventDefault();
  backupDropContainer.classList.remove('dragover');
}
backupDropContainer.ondrop = (e) => {
  e.preventDefault();
  backupDropContainer.classList.remove('dragover');
  var reader = new FileReader();
  reader.onload = processFile(e.dataTransfer.files[0]);
  let n = e.dataTransfer?.files[0]?.name

  if (n && n.indexOf('.backup') == n.length - 7 || n && n.indexOf('.backup.txt') == n.length - 11) {
    reader.readAsText(e.dataTransfer.files[0]);
  } else {
    HelperWASD.showMessage(`только .backup файлы`, 'error');
  }
};

document.querySelector('.backup-download').addEventListener('click', async () => {
    settings = await HelperWASD.getSettings();

    HelperWASD.download(`BetterWASD-bot.backup`, JSON.stringify(settings));
});

document.querySelector('.backup-reset').addEventListener('dblclick', () => {
  chrome.storage[storageType].set(Helper.getDefaultSettings(), () => {
    window.close()
  })
});

