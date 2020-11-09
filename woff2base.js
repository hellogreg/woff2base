// TODO: Copy to Clipboard: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
// TODO: Check mime type: https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload


(function () {

  const $currentfont = document.getElementById("currentfont");
  const $csscode = document.getElementById("csscode");

  function dir(m) {
    if (console.dir && m) {
      console.dir(m);
    }
  }

  function log(m) {
    if (console.log) {
      m = m !== undefined ? m : "-----------------";
      console.log(m);
    }
  }

  function displayFontInfo(name, text) {
    const cssHeader = `@font-face { \r\n` +
      `  font-family: "${name}";\r\n` +
      `  /* Add other properties here, as needed. For example: */\r\n` +
      `  /*\r\n` +
      `  font-weight: 100 900;\r\n` +
      `  font-style: normal italic;\r\n` +
      `  */\r\n` +
      `  src: url(`;

    const cssFooter = `);\r\n` +
      `}`;

    $currentfont.innerHTML = name;
    $csscode.value = cssHeader + text + cssFooter;

    //console.clear();
    //log(text);
  }

  function convertFontFile() {
    const file = document.getElementById("fontinput").files[0];
    const fileName = file.name;
    //dir(file);
    let fontName = "";
    let fontBase64 = "";
    const readerFontkit = new FileReader();
    const readerBase64 = new FileReader();

    try {
      if (fileName.endsWith(".woff2") || fileName.endsWith(".woff") || fileName.endsWith(".ttf")) {
        readerFontkit.readAsArrayBuffer(file);
        readerFontkit.onload = (e) => {
          const arrayBuffer = readerFontkit.result;
          const fontkitBuffer = new Buffer(arrayBuffer);
          const font = fontkit.create(fontkitBuffer);
          fontName = font.familyName
          log("Fontkit reader loaded...");
          //dir(fontName);
        }
        readerBase64.readAsDataURL(file);
        readerBase64.onload = (e) => {
          log("Base64 reader loaded...");
          fontBase64 = e.target.result;
          //dir(e);
          displayFontInfo(fontName, fontBase64);
          log(fontBase64)
        }
        displayFontInfo(fontName, fontBase64);
      } else {
        $csscode.value = `Sorry. I couldn't read ${fileName}. `
          + `If you submitted a valid font, maybe it was in a `
          + `format this app doesn't understand (e.g., .eot).`;
      }
    } catch (e) {
      log(e);
    } finally {
    }
  }

  function loadDefaultFont() {
    const fontName = "Firava";
    const fontPath = "fonts/Firava.woff2";
    fetch(fontPath)
      .then(response => response.blob())
      .then(font => {
        const reader = new FileReader();
        reader.onload = function () {
          let fontBase64 = this.result;
          //displayFontInfo(fontName, fontBase64);
        };
        reader.readAsDataURL(font);
      });
  }

  function listenForFontChooser() {
    document.getElementById("fontinput").addEventListener("change", convertFontFile, false);
  }

  window.addEventListener("DOMContentLoaded", function () {
    //loadDefaultFont();
    listenForFontChooser();
    displayFontInfo("", "");
  });



}());
