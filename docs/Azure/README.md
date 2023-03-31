---
title: Azure 相关
date: 2023-3-31
categories:
  - backend
tags:
  - azure
sidebar: "auto"
publish: true
---

## 👋 Azure 相关调研存档

::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::

## 🤖️ Speech to Text 语音转文字

```js
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');

class AzureSpeech2Text {
  constructor() {
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    this.SPEECH_KEY = 'SPEECH_KEY';
    this.SPEECH_REGION = 'SPEECH_REGION';
    this.speechConfig = sdk.SpeechConfig.fromSubscription(this.SPEECH_KEY, this.SPEECH_REGION);
    this.speechConfig.enableDictation(); // 促使语音配置实例解释对句子结构（如标点符号）进行的字面描述
    this.speechConfig.setProfanity(sdk.ProfanityOption.Masked); // 将不雅词语中的字母替换为星号 (*) 字符
    this.autoDetectSourceLanguageConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(['en-US', 'zh-CN', 'ja-JP']);
    this.audioConfig = null;
    this.speechRecognizer = null;
  }

  // 全部识别完成后返回，
  recognizeOnceAsync(wavUrl) {
    this.audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(wavUrl));
    this.speechRecognizer = sdk.SpeechRecognizer.FromConfig(this.speechConfig, this.autoDetectSourceLanguageConfig, this.audioConfig);

    // 单次全部返回
    this.speechRecognizer.recognizeOnceAsync((result) => {
      switch (result.reason) {
        case sdk.ResultReason.RecognizedSpeech:
          console.log(`RECOGNIZED: Text=${result.text}`);
          break;
        case sdk.ResultReason.NoMatch:
          console.log('NOMATCH: Speech could not be recognized.');
          break;
        case sdk.ResultReason.Canceled:
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`CANCELED: Reason=${cancellation.reason}`);
          if (cancellation.reason == sdk.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            console.log('CANCELED: Did you set the speech resource key and region values?');
          }
          break;
      }
      this.speechRecognizer.close();
    });
  }

  // 连续识别，返回给前端的话，返回recognized的部分就行 
  continuousRecognitionAsync(wavUrl) {
    this.audioConfig = sdk.AudioConfig.fromStreamInput(fs.createReadStream(wavUrl));
    this.speechRecognizer = sdk.SpeechRecognizer.FromConfig(this.speechConfig, this.autoDetectSourceLanguageConfig, this.audioConfig);

    // 流式返回，返回给前端的话，返回recognized的部分就行
    this.speechRecognizer.recognizing = (s, e) => {
      // console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    this.speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      } else if (e.result.reason == sdk.ResultReason.NoMatch) {
        console.log('NOMATCH: Speech could not be recognized.');
      }
    };
    this.speechRecognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason == sdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you set the speech resource key and region values?');
      }

      this.speechRecognizer.stopContinuousRecognitionAsync();
    };
    this.speechRecognizer.sessionStopped = (s, e) => {
      // console.log('\n    Session stopped event.');
      this.speechRecognizer.stopContinuousRecognitionAsync();
      process.exit(1); // ^_^
    };

    this.speechRecognizer.startContinuousRecognitionAsync();
  }
}

const azureSpeech2Text = new AzureSpeech2Text();
// azureSpeech2Text.recognizeOnceAsync('hello.wav');
// azureSpeech2Text.continuousRecognitionAsync('hello.wav');
// azureSpeech2Text.continuousRecognitionAsync('test.mp3');

```