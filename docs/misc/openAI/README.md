---
title: 使用JS调用OpenAI API
date: 2023-2-18
categories:
  - Me
tags:
  - me
sidebar: "auto"
publish: true
showSponsor: true
---

## 使用JS调用OpenAI API

> 分为 await 和 stream 两种方式

```js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: 'sk-123456789876543421',
});

const openai = new OpenAIApi(configuration);

async function main() {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "你好,今天你的心情好吗？",
        temperature: 0.7,
        max_tokens: 1000,
        // stream: true
    }, {
      timeout: 120000,
      timeoutErrorMessage: 'open ai timeout',
      // responseType: 'stream'
    });

    console.log(response.data?.choices?.[0]?.text);
    
    //   Stream
    //   response.data.on("data", (data) => {
    //     const lines = data
    //         ?.toString()
    //         ?.split("\n")
    //         .filter((line) => line.trim() !== "");
    //     for (const line of lines) {
    //         const message = line.replace(/^data: /, "");
    //         if (message == "[DONE]") {
    //            console.log(message)
    //         } else {
    //             let token;
    //             try {
    //                 token = JSON.parse(message)?.choices?.[0]?.text;
    //                 result.data += token
    //                 console.log(token)
    //             } catch {
    //                 console.log(token);
    //             }
    //         }
    //     }
    //   });
    
}

main();
```