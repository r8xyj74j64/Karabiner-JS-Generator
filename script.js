function generateJS() {
    // カンマで区切られた入力を受け取り、配列に分解（前後のスペースも自動削除）
    var fromKeys = document.getElementById('fromKey').value.split(',').map(function(item) { return item.trim(); });
    var bundleIds = document.getElementById('bundleId').value.split(',').map(function(item) { return item.trim(); });
    
    // 入力数に合わせてループ回数を決定
    var maxLen = Math.max(fromKeys.length, bundleIds.length);
    
    // main()関数内の「openApplication('キー', 'ID')」の行を動的に生成
    var mainCallsCode = "";
    for (var i = 0; i < maxLen; i++) {
        var fk = fromKeys[i] || "";
        var bid = bundleIds[i] || "";
        
        // 空白行を作らないための安全策
        if (fk === "" && bid === "") continue;

        mainCallsCode += "      openApplication('" + fk + "', '" + bid + "')";
        
        // 最後の要素以外にはカンマと改行を付ける
        if (i < maxLen - 1) {
            mainCallsCode += ",\n";
        }
    }

    // あなたが提示してくれた美しいマクロ形式のテンプレートにそのままハメ込む
    var template = 
`// JavaScript must be written in ECMAScript 5.1.

function main() {
  return {
    description: 'Open apps with right_shift+1/2/3',
    description_notes: ['- right_shift+1/2/3: Safari/TextEdit/ActivityMonitor'],
    manipulators: [
${mainCallsCode}
    ]
  }
}

function openApplication(from, bundleIdentifier) {
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

    document.getElementById('output').value = template;
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
