// import "./cvars/4.26.2-en.js";
// import "./cvars/4.27.2-en.js";
// import "./cvars/5.0.3-en.js";
// import "./cvars/5.1.1-en.js";
// import "./cvars/5.2.1-en.js";
// import "./cvars/5.3.2-en.js";
// import "./cvars/5.4.4-en.js";
// import "./cvars/5.5.4-en.js";
// import "./cvars/5.6.0-en.js";

const ueVersions =
    [
        { display: "5.6.0",  cvar: cvars560 },
        { display: "5.5.4",  cvar: cvars554 },
        { display: "5.4.4",  cvar: cvars544 },
        { display: "5.3.2",  cvar: cvars532 },
        { display: "5.2.1",  cvar: cvars521 },
        { display: "5.1.1",  cvar: cvars511 },
        { display: "5.0.3",  cvar: cvars503 },
        { display: "4.27.2", cvar: cvars4272 },
        { display: "4.26.2", cvar: cvars4262 },
    ];

const presetRegexes =
    [
        { lv: 1, display: "All",                    regex: "" },
        { lv: 1, display: "Rendering",              regex: "^r\\." },
        { lv: 2, display: "Ambient Occlusion",      regex: "^r\\.((DefaultFeature\\.)?AmbientOcclusion|AO)" },
        { lv: 2, display: "Shadow",                 regex: "^r\\.Shadow" },
        { lv: 2, display: "Light",                  regex: "^r\\.(Sky)?Light" },
        { lv: 2, display: "Reflection",             regex: "^r\\.(Reflection|SSR|SSS)" },
        { lv: 2, display: "Global Illumination",    regex: "^r\\.((Dynamic)?GlobalIllumination|SSGI)" },
        { lv: 2, display: "Anti Aliasing",          regex: "^r\\.(DefaultFeature\\.)?AntiAliasing" },
        { lv: 3, display: "FXAA",                   regex: "^r\\.FXAA" },
        { lv: 3, display: "TAA",                    regex: "^r\\.TemporalAA" },
        { lv: 3, display: "MSAA",                   regex: "^r\\.MSAA" },
        { lv: 3, display: "TSR",                    regex: "^r\\.TSR" },
        { lv: 2, display: "Post Process",           regex: "^r\\.PostProcess" },
        { lv: 3, display: "Tonemapper",             regex: "^r\\.(Tonemapper|SceneColor)" },
        { lv: 3, display: "Motion Blur",            regex: "^r\\.(DefaultFeature\\.)?MotionBlur" },
        { lv: 3, display: "Exposure",               regex: "^r\\.((DefaultFeature\\.)?AutoExposure|EyeAdaptation)" },
        { lv: 2, display: "Distance Field",         regex: "^r\\.((Global)?(GenerateMesh)?DistanceField|DF)" },
        { lv: 2, display: "Volumetric",             regex: "^r\\.Volumetric" },
        { lv: 2, display: "Lumen",                  regex: "^r\\.Lumen" },
        { lv: 2, display: "Ray Tracing",            regex: "^r\\.RayTracing" },
        { lv: 2, display: "Path Tracing",           regex: "^r\\.PathTracing" },
        { lv: 2, display: "HDR",                    regex: "^r\\.HDR" },
        { lv: 1, display: "FX",                     regex: "^fx\\." },
        { lv: 1, display: "Niagara",                regex: "^niagara\\." },
        { lv: 1, display: "Animation",              regex: "^a\\." },
        { lv: 1, display: "Streaming",              regex: "^(s\\.|r\\.Streaming)" },
        { lv: 1, display: "Garbage Collection",     regex: "^gc\\." },
        { lv: 1, display: "Networking",             regex: "^net\\." },
    ];

function heById(eid) {
    return document.getElementById(eid);
}

function heByName(eid) {
    return document.getElementsByName(eid);
}

const heVersionList = heById("s-ver-list");
const heVLVersionName = "s-vl-version";
const hePresetList = heById("s-preset-list");
const hePLRegexName = "s-pl-regex";
const heInputPattern = heById("s-input-pattern");
const heResultList = heById("s-result-list");
var heInputPatternTimer = null;

function onInit() {
    ueVersions.forEach(value => {
        heVersionList.innerHTML +=
            `<div>
                <input type="radio" name="${heVLVersionName}">${value.display}
            </div>`;
    });
    heByName(heVLVersionName).forEach((he, he_i) => {
        he.addEventListener("click", onStartSearch);
        if (he_i == 0)
            he.checked = true;
    });

    presetRegexes.forEach(value => {
        hePresetList.innerHTML +=
            `<div>
                <li class="lv${value.lv}" name="${hePLRegexName}" regex="${value.regex}">${value.display}</li>
            </div>`;
    });
    heByName(hePLRegexName).forEach((he, he_i) => {
        he.addEventListener("click", () => {
            heInputPattern.value = presetRegexes[he_i].regex;
            onStartSearch();
        });
    });

    heInputPattern.addEventListener("input", () => {
        clearTimeout(heInputPatternTimer);
        heInputPatternTimer = setTimeout(onStartSearch, 500);
    });
}

function onStartSearch() {
    heResultList.innerHTML = "";

    var ue_version = ueVersions[0];
    heByName(heVLVersionName).forEach((value, i) => {
        if (value.checked)
            ue_version = ueVersions[i];
    });

    var pattern = heInputPattern.value.toLowerCase();
    var result = "";
    ue_version.cvar.forEach(value => {
        if (value.name.toLowerCase().match(pattern) ||
            value.help.toLowerCase().match(pattern))
            result += `<div>
                        <div>${value.type}</div>
                        <div>${value.name}</div>
                        <div>${value.help.replaceAll("\n", "<br>")}</div>
                        </div>`;
    });

    if (result.length == 0) {
        result = `<div style="font-size: 3rem">🤔</div>`;
    }
    heResultList.innerHTML = result;
}

onInit();
onStartSearch();
