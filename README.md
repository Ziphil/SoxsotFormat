<div align="center">
<h1>Soxsot Format</h1>
</div>

![](https://img.shields.io/github/package-json/v/Ziphil/SoxsotFormat)
![](https://img.shields.io/github/commit-activity/y/Ziphil/SoxsotFormat?label=commits)


## Overview
Outputs an XSL-FO string for publication from a Shaleian dictionary data.
You can generate a printable PDF file by typesetting the output XSL-FO string using [AHFormatter](https://www.antenna.co.jp/AHF/).
The PDF file generated using this package is available [here](http://ziphil.com/conlang/database/8.html).

シャレイア語辞典データから出版用の XSL-FO 文字列を出力します。
出力された XSL-FO 文字列を [AHFormatter](https://www.antenna.co.jp/AHF/) で組版することで、印刷して使える PDF ファイルを生成することができます。
このパッケージを利用して生成した PDF は[こちら](http://ziphil.com/conlang/database/8.html)で公開しています。

## Installation
Install via [npm](https://www.npmjs.com/package/soxsot-format).
```
npm i soxsot-format
```

## Usage
This package exports only one class: `DictionaryFormatBuilder`.
Create an instance of this class and call the `convert` method.

```typescript
import {DictionaryFormatBuilder} from "soxsot-format";
let builder = new DictionaryFormatBuilder(dictionary);
let documentString = builder.convert(dictionary);  // XSL-FO string
```