---
title: A look into the Nothing X smartwatch app
date: 07/30/2026
description: One of my first serious reversing attempts
draft: true
---


Some time ago i decided to buy a smartwatch, mainly because i want to keep track of my health, plus it makes for a nice accessory. While window-shopping on the interwebs, i found an auction on Aukro - basically the Czech Republic's analogue of eBay - for a CMF watch 3 pro, the technical specs looked good enough. Besides the aesthetics, which really caught my eye and were just one more reason to bid on it.

A few things that caught my eye:
- i found out quite early from the Chinese slice of the internet the main SoC is an [Action-Tech/Semi ATS3089C]()[^1].
- the watch has built-in dual-band GPS which is quite neat.
- Nothing advertises 13 hours of battery life.

I ended up winning the auction so, yay - the watch is mine!
#### A curious cat, is a happy cat
I am a simple woman: i own new hardware, i need to **touch it** or i'll explode.
Put into more sane terms, i always want to try and hack and take apart (if possible) gadgets when i get my hands on them. 
Just a few days after my purchase the perfect occasion popped up! Nothing released a firmware update: Version 1.0.77. The changelog is very informative and detailed, describing the changes as "Enhanced overall user experience" - ngl, probably written by an LLM held at taserpoint, considering the preceding text that reads: "A new update is here with enhancements and fixes. Here's what's new in this update:".
#### Packet capture in progress...
[Moving on](https://www.youtube.com/watch?v=qeMFqkcPYcg), i tried what worked for me in the past in a similar situation - different smartwatch, a Samsung Fit 3 - using [PCAPDroid](https://github.com/emanuele-f/pcapdroid) to download some traffic and analyze it in Wireshark later.
Previously, Samsung's firmware used a non-encrypted connection (just HTTP) to download which allowed me to simply recover the image from the capture.
Nothing rightfully decided using HTTP is stupid, so this didn't work. The file goes through HTTPS, so no shot decrypting that.
As a second attempt, i tried running PCAPDroid's MITM[^2] server, in the backend this runs the [mitmproxy](https://github.com/mitmproxy/mitmproxy) service and you're required to install their CA certificate for it to work. 

>little side note and for future reference, there's something i just noticed in the app's readme: "For rooted devices, the [pcapd daemon](https://github.com/emanuele-f/PCAPdroid/tree/master/app/src/main/jni/pcapd) can be directly integrated into your APK to capture network packets."

This also didn't work, Nothing's app probably detected either the certificate or the proxy was running and just reported a network error when refreshing the firmware updates page.
All that was left was looking into the app.
#### Disassembling in JADX
My next tool of choice was [JADX](https://github.com/skylot/jadx), although i'll admit i was quite lost here, i haven't done any significant amounts of software reverse engineering to know my way around classes, structs and code, i'd rank the experience above looking at MacOS applications in IDA though.
My first instinct was to look for strings or classes that mention: "OTA", "firmware", "update", stuff like that. Searching the second option produced a few results that seemed like a good lead, i found out Nothing names their watches and earbuds under the hood just like the majority of smartphone devices. Now, i'll admit i may have ADHD which led me to laser focus on these names for a good part of the search and i kinda burned through my motivation initially.

When [Local](https://localcc.cc/) pointed out what i was doing was stupid, and gave me some directions, i was able to get back on track. This is when i decided i was going to try a more practical approach and hook methods in the app with [Frida](https://frida.re/), a pretty nifty tool for reverse engineering, which supports scripting.
Using Frida is pretty easy, all i had to do was install the server service on my phone following [the guide on their website](https://frida.re/docs/android/), i unfortunately fell into the javascript scripting hellhole soon after, i despise every second i had to write js. I used LLMs to aid me in writing a few drafts, then picked bits and pieces here and there that became my final script, a lot of the reversing involved going through network request methods and hooking hoping something will print when running the app.

The process looked a bit like this:
1. find a `function` or `class` that looks promising.
2. Write/Modify the script to hook and print a simple "program passed through here" message.
3. repeat.

I had a good look around all of the classes i could find that looked interesting, i ended up settling on `com.nothing.log.Logger` which was the right choice, as it prints out information through android's log accessible via  `adb logcat` with USB debugging enabled. 

![image]("./Pasted image 20260730154905.png")

Hooking onto `isCanLogger` and returning true for every call is what enabled me to view a basic level of prints in the console.
 "
![image]("./Pasted image 20260730155536.png")

It's called in many functions when printing is mentioned, to report method arguments and return values and this was perfect in my case! The OTA update URL was right in the logs, along with other interesting downloads.

![image]("./Pasted image 20260730160126.png")

Before my success, i hooked a few different methods: 
The first, named `NetWorkConstant`, its structure caught my eye:
```kotlin
public final class NetWorkConstant {  
    public static final String DEBUG = "DEBUG";  
    public static final String DEFAULT_HOST = "DEFAULT";  
    public static final String HEAD_SCHEME = "SCHEME_URL";  
    public static final String HOST_CMF_URL = "HOST_CMF_URL";  
    public static final String HOST_DATA_COLLECTION = "HOST_DATA_COLLECTION";  
    public static final String HOST_DEFAULT = "SCHEME_URL:DEFAULT";  
    public static final String HOST_MIMI_URL = "HOST_MIMI_URL";  
    public static final String HOST_OTA = "HOST_OTA";  
    public static final String HOST_SUPPORT_URL = "HOST_SUPPORT_URL";  
    public static final String HOST_ZENDESK = "SCHEME_URL:HOST_ZENDESK_LIKE_URL";  
    public static final String HOST_ZENDESK_LIKE_URL = "HOST_ZENDESK_LIKE_URL";  
    public static final String HOST_ZENDESK_URL = "HOST_ZENDESK_URL";  
    public static final String URL_CONTACT_US = "https://nothing.tech/pages/contact-support";  
    private static Function0<Boolean> isAlphaAction = null;  
    public static final long timeOut = 60;  
    public static final NetWorkConstant INSTANCE = new NetWorkConstant();  
    private static HashMap<String, String> URL_MAP = new HashMap<>(); 
	...
```

Local suggested it too, but i didn't have much success, nothing useful returned in the console - the neighbouring class `NetworkLoadRepo` has some interesting stuff too, it mentions the earlier class and calls the `getURL_MAP()` method from it, from what i understand this static block is code running before the owning class is initialized - i tried hooking it on startup but the app would always crash.

```kotlin
static {  
	NetworkLoadRepo networkLoadRepo = new NetworkLoadRepo();  
	INSTANCE = networkLoadRepo;  
	Retrofit.Builder builder = new Retrofit.Builder();  
	String str = NetWorkConstant.INSTANCE.getURL_MAP().get(NetWorkConstant.DEFAULT_HOST);  
	Intrinsics.checkNotNull(str);  
	Retrofit retrofitBuild = builder.baseUrl(str).client(networkLoadRepo.createOkhttpClient()).validateEagerly(true).build();  
	Intrinsics.checkNotNullExpressionValue(retrofitBuild, "build(...)");  
	retrofit = retrofitBuild;  
	Object objCreate = retrofitBuild.create(NetworkLoadApiService.class);  
	Intrinsics.checkNotNullExpressionValue(objCreate, "create(...)");  
	apiService = (NetworkLoadApiService) objCreate;  
}
```

The final Frida script i made has a bunch of extra methods i didn't use, the useful ones are called with `setImmediate` at the end of the file:

```javascript
function dumpNetworkLoadRepoFields() {
    Java.perform(function () {        
        
	var NetworkLoadRepo = Java.use("com.nothing.network.core.load.NetworkLoadRepo");
		console.log("[NetworkLoadRepo] INSTANCE: " + NetworkLoadRepo.INSTANCE.value);
		console.log("[NetworkLoadRepo] retrofit: " + NetworkLoadRepo.retrofit.value);
		console.log("[NetworkLoadRepo] apiService: " + NetworkLoadRepo.apiService.value);
    });
}

function isLogger() {
    var Logger = Java.use("com.nothing.log.Logger");
    Logger["isCanLogger"].implementation = function (canWrite) {
        console.log(`Logger.isCanLogger was called: canWrite=${canWrite}`);
        return true;
    };
    Logger["isDebugEnabled"].implementation = function (canWrite) {
        console.log("Logger.isDebugEnabled was called");
        return true;
    };
}

setImmediate(isLogger);
setImmediate(dumpNetworkLoadRepoFields);
```
and voilà, after a quick search in the logs i found the ota update url:
```
data:{"success":true,"code":200,"timestamp":1785068168836,"msg":"成功","msgCode":null,"data":{"version":"1.0.1.77","otaUrl":"https://d1zc89dd4u2mk2.cloudfront.net/ota/1779242462258JX402_08_ATS3089C_V1.0.1.77_GPS_V6_20260418.bin","needUpdate":1,"description":"Enhanced overall user experience","fileSize":45069312,"sha256":"cf381188eb5fe26a14047a03697e68b58785bdcd01c4baf8703d4624650c6352","releaseNote":null,"forcedUpgrade":false,"mediaVersion":false}}
```

In the next blog post i'll talk about reversing the binary, so be on the look out for that! 
	^^ written Thursday 30th July 2026, let's see how long this takes me.

[^1]: https://www.52audio.com/archives/265085.html 
[^2]: Man-In-The-Middle
