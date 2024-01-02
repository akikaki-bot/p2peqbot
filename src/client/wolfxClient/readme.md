# Wolfx Client

[Wolfx API](https://api.wolfx.jp)の情報をEventEmitter方式にしたものです。

詳しい仕様はコード見てください。

# How to use

```ts

const client = new WolfxManager();

client.on('ready', () => console.log('Successfully connected'));

client.on('eew', (data) => {
    // EEWの何らかの処理
})

```

# Licence

非公式なのでMITです