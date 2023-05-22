# Sound generation process

## Engine

[Google text to speech](https://cloud.google.com/text-to-speech/)

### Settings

- Female voice

    ``` json
    {
        "input": {
            "text": "<input>"
        },
        "voice": {
            "languageCode": "en-US",
            "name": "en-US-Neural2-F"
        },
        "audioConfig": {
            "audioEncoding": "LINEAR16",
            "pitch": 0,
            "speakingRate": 1,
            "effectsProfileId": ["small-bluetooth-speaker-class-device"]
        }
    }
    ```

- Male voice

    ``` json
    "req": {
        "input": {
            "text": "100"
        },
        "voice": {
            "languageCode": "en-US",
            "name": "en-US-Neural2-J"
        },
        "audioConfig": {
            "audioEncoding": "LINEAR16",
            "pitch": 0,
            "speakingRate": 1,
            "effectsProfileId": ["small-bluetooth-speaker-class-device"]
        }
    },
    ```

### Hack-ish way to re-generate

``` js
From console

tsapp = document.querySelector("body > ts-app")

var __result__ = ""
run = function(num) {
    var {...req} = tsapp.requestObject
    req.input.text = num
    return tsapp.sendAudioRequest_(tsapp.urlSynthesize, req).then(function(c) {
        c = JSON.parse(c);
        var t = "data:audio/wav;base64" + "," + c.audioContent;
        __result__ = __result__ + `{"`+num+`":"`+t+`"},`

    }, function(c) {
        console.error("Failed!", c)
    })
}
createChain = function () {
    let a = ["20", "30", "40", "50", "60", "70", "80", "90", "100"]; //change me
    let chain = Promise.resolve();
    a.forEach(i =>
        chain = chain.then(()=>run(i))
    );
    return chain;
}
ch = createChain()
ch

// Wait for chain of promises

__result__

```