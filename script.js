function generateJS() {
    // カンマで区切られた入力を受け取り、配列に分解（前後のスペースも自動削除）
    var bundleIds = document.getElementById('bundleId').value.split(',').map(function(item) { return item.trim(); });
    var fromKeys = document.getElementById('fromKey').value.split(',').map(function(item) { return item.trim(); });
    var toKeys = document.getElementById('toKey').value.split(',').map(function(item) { return item.trim(); });
    
    // 最多の入力数に合わせてループ回数を決定
    var maxLen = Math.max(bundleIds.length, fromKeys.length, toKeys.length);
    
    // マニピュレータ部分の記述を動的に生成
    var manipulatorsCode = "";
    for (var i = 0; i < maxLen; i++) {
        var bid = bundleIds[i] || bundleIds[0]; // 足りない場合は最初の要素で補完
        var fk = fromKeys[i] || fromKeys[0];
        var tk = toKeys[i] || toKeys[0];
        
        // 修飾キー（例: shift+1 や cmd+space などの「+」）があるか判定
        var mandatoryModifiers = [];
        var baseKey = fk;
        
        if (fk.indexOf('+') !== -1) {
            var parts = fk.split('+');
            baseKey = parts[parts.length - 1].trim(); // 最後の要素が実際のキー名
            
            // それより前の要素を修飾キーとして格納 (shift, command, control, option)
            for (var j = 0; j < parts.length - 1; j++) {
                var mod = parts[j].trim().toLowerCase();
                // 左右の指定がない場合は汎用的な名前に補正
                if (mod === 'shift') mod = 'shift';
                if (mod === 'cmd' || mod === 'command') mod = 'command';
                if (mod === 'ctrl' || mod === 'control') mod = 'control';
                if (mod === 'opt' || mod === 'option') mod = 'option';
                mandatoryModifiers.push('"' + mod + '"');
            }
        }
        
        // 1つの割り当てブロックを組み立て
        manipulatorsCode += "      {\n";
        manipulatorsCode += "        type: 'basic',\n";
        manipulatorsCode += "        conditions: [\n";
        manipulatorsCode += "          {\n";
        manipulatorsCode += "            type: 'frontmost_application_if',\n";
        manipulatorsCode += "            bundle_identifiers: ['" + bid + "']\n";
        manipulatorsCode += "          }\n";
        manipulatorsCode += "        ],\n";
        manipulatorsCode += "        from: {\n";
        manipulatorsCode += "          key_code: '" + baseKey + "'";
        
        // 修飾キーの指定がある場合のみ mandatory を追加
        if (mandatoryModifiers.length > 0) {
            manipulatorsCode += ",\n          modifiers: {\n";
            manipulatorsCode += "            mandatory: [" + mandatoryModifiers.join(', ') + "],\n";
            manipulatorsCode += "            optional: ['any']\n";
            manipulatorsCode += "          }\n";
        } else {
            manipulatorsCode += ",\n          modifiers: { optional: ['any'] }\n";
        }
        
        manipulatorsCode += "        },\n";
        manipulatorsCode += "        to: [\n";
        manipulatorsCode += "          { key_code: '" + tk + "' }\n";
        manipulatorsCode += "        ]\n";
        manipulatorsCode += "      }";
        
        // 最後の要素以外にはカンマを付ける
        if (i < maxLen - 1) {
            manipulatorsCode += ",\n";
        }
    }

    // 全体のテンプレートに流し込む
    var template = 
`// JavaScript must be written in ECMAScript 5.1.

function main() {
  return {
    description: '複数一括カスタムマッピング',
    manipulators: [
${manipulatorsCode}
    ]
  };
}

main();`;

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
