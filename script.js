function generateJS() {
    var bundleId = document.getElementById('bundleId').value.trim();
    var fromKey = document.getElementById('fromKey').value.trim();
    var toKey = document.getElementById('toKey').value.trim();
    
    // 不要な記号を一切つけず、そのまま適用する
    var template = 
`// JavaScript must be written in ECMAScript 5.1.\n\n` +
`function main() {\n` +
`  var targetApp = '${bundleId}';\n\n` +
`  return {\n` +
`    description: '${bundleId} 用のカスタムマッピング',\n` +
`    manipulators: [\n` +
`      {\n` +
`        type: 'basic',\n` +
`        conditions: [\n` +
`          {\n` +
`            type: 'frontmost_application_if',\n` +
`            bundle_identifiers: [targetApp]\n` +
`          }\n` +
`        ],\n` +
`        from: {\n` +
`          key_code: '${fromKey}',\n` +
`          modifiers: { optional: ['any'] }\n` +
`        },\n` +
`        to: [\n` +
`          { key_code: '${toKey}' }\n` +
`        ]\n` +
`      }\n` +
`    ]\n` +
`  };\n` +
`}\n\n` +
`main();`;

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
    
    // コピーボタンの文字を一時的に変える演出
    var copyBtn = document.getElementById('btn-copy');
    copyBtn.innerText = 'コピーしました！';
    setTimeout(function() {
        copyBtn.innerText = 'コピーする';
    }, 1500);
}
