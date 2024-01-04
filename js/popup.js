const save = document.getElementById('save');
const clear = document.getElementById('clear');
const copy = document.getElementById('copy');
const paramsTextArea = document.getElementById('params');
const listLinksTextArea = document.getElementById('listLinks');
const copyMessage = document.getElementById('copyMessage');


chrome.storage.sync.get(['params', 'listLinks'], function (result) {
  if (result.params) {
    paramsTextArea.value = result.params;
  }
  if (result.listLinks) {

    let listObj = result.listLinks
    const newText = Object.entries(listObj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}\n${value.filter(Boolean).join('\n')}`)
    .join('\n');

    listLinksTextArea.value = newText;
    listLinksTextArea.style.height = (15*newText.split("\n").length)+"px";
  }
});

save.addEventListener('click', (event) => {
  const params = paramsTextArea.value;
  let paramsArr = [...new Set(params.split('\n').filter(Boolean))];
  paramsArr.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  let newParams = paramsArr.join("\n");

  const lines = listLinksTextArea.value;
  const result = {};
  if(lines!=""){
    let key = '';
    let lineArr = lines.split("\n")
    lineArr.forEach((line) => {
      if (line==="") return;
      if (!line.startsWith('https://')) {
        key = line;
        result[key] = [];
      } else {
        result[key].push(line);
      }
    });
  }
  

  paramsTextArea.value = newParams;
  chrome.storage.sync.set({ 'params': newParams, 'listLinks': result }, function () {
    console.log('Text saved to Chrome storage');
  });
});


const copyContent = async () => {
  console.log("clicked on copy button")
  try {
    await navigator.clipboard.writeText(listLinksTextArea.value);
    console.log('Content copied to clipboard');
    listLinksTextArea.select()
    copyMessage.style.display = 'block';
    setTimeout(() => {
      copyMessage.style.display = 'none';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
copy.addEventListener('click', copyContent);

clear.addEventListener('click', function(event){
  listLinksTextArea.value = "";
});

listLinksTextArea.addEventListener("input", function(e){
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});