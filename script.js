function generateJS() {
    // カンマで区切られた入力を受け取り、配列に分解（前後のスペースも自動削除）
    var fromKeys = document.getElementById('fromKey').value.split(',').map(function(item) { return item.trim(); });
    var bundleIds = document.getElementById('bundleId').value.split(',').map(function(item) { return item.trim(); });
    
    // 入力数に合わせてループ回数を決定
    var maxLen = Math.max(fromKeys.length, bundleIds.length);
    
    // main()関数内の「openApplication('キー', 'ID')」の行、および注釈用の文字列を動的に生成
    var mainCallsCode = "";
    var notesArray = [];
    
    for (var i = 0; i < maxLen; i++) {
        var fk = fromKeys[i] || "";
        var bid = bundleIds[i] || "";
        
        // 空白行を作らないための安全策
        if (fk === "" && bid === "") continue;

        mainCallsCode += "      openApplication('" + fk + "', '" + bid + "')";
        
        // 注釈テキスト用の形式を組み立て (例: "- Shift+2: com.apple.Safari")
        notesArray.push("'- " + fk + ": " + bid + "'");
        
        // 最後の要素以外にはカンマと改行を付ける
        if (i < maxLen - 1) {
            mainCallsCode += ",\n";
        }
    }

    // description用の文言（最初のアプリ名か、複数あれば一括マッピングとする）
    var descText = bundleIds[0] ? bundleIds[0] + ' 等を開くマクロ' : 'アプリ起動カスタムマッピング';
    // description_notesの配列を結合
    var notesText = notesArray.join(',\n      ');

    // 1. 前半部分の文字列を作成（ここを入力内容に合わせて可変にしました！）
    var headerPart = 
`// JavaScript must be written in ECMAScript 5.1.

function main() {
  return {
    description: '${descText}',
    description_notes: [
      ${notesText}
    ],
    manipulators: [
${mainCallsCode}
    ]
  }
}\n\n`;

    // 2. 後半部分（定型文マクロ関数とmain()の呼び出し）の文字列を作成
    var footerPart = 
`function openApplication(from, bundleIdentifier) {
  // Output a debug message
  console.log(from + ' -> ' + bundleIdentifier)

  return {
    type: 'basic',
    from: {
      key_code: from,
      modifiers: {
        mandatory: ['right_shift'],
      },
    },
    to: [
      {
        software_function: {
          open_application: { bundle_identifier: bundleIdentifier },
        },
      },
    ],
  }
}

main()`;

    // 3. 前半と後半を確実に結合してテキストエリアに出力
    document.getElementById('output').value = headerPart + footerPart;
}

function clearFields() {
    document.getElementById('bundleId').value = '';
    document.getElementById('fromKey').value = '';
    document.getElementById('toKey').value = '';
    document.getElementById('output').value = '';
}

function copyToClipboard() {
    var outputArea = document.getElementById('output');
    if (!outputArea.value) return;
    
    outputArea.select();
    document.execCommand('copy');
    
    var copyBtn = document.getElementById('btn-copy');
    copyBtn.innerText = 'コピーしました！';
    setTimeout(function() {
        copyBtn.innerText = 'コピーする';
    }, 1500);
}
