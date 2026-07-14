const ueVersions =
    [
        { display: "5.8.0",  cvar: cvars580 },
        { display: "5.7.4",  cvar: cvars574 },
        { display: "5.6.1",  cvar: cvars561 },
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
        { lv: 3, display: "VSM",                    regex: "^r\\.Shadow.Virtual" },
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
        { lv: 2, display: "Nanite",                 regex: "^r\\.Nanite\\." },
        { lv: 2, display: "MegaLights",             regex: "^r\\.MegaLights\\." },
        { lv: 2, display: "Ray Tracing",            regex: "^r\\.RayTracing" },
        { lv: 2, display: "Path Tracing",           regex: "^r\\.PathTracing" },
        { lv: 2, display: "HDR",                    regex: "^r\\.HDR" },
        { lv: 1, display: "Streaming",              regex: "^(s\\.|r\\.Streaming)" },
        { lv: 1, display: "FX",                     regex: "^fx\\." },
        { lv: 1, display: "Niagara",                regex: "^niagara\\." },
        { lv: 1, display: "PCG",                    regex: "^pcg\\." },
        { lv: 1, display: "Animation",              regex: "^a\\." },
        { lv: 1, display: "Garbage Collection",     regex: "^gc\\." },
        { lv: 1, display: "Networking",             regex: "^net\\." },
    ];

function heById(eid) {
    return document.getElementById(eid);
}

function heByName(eid) {
    return document.getElementsByName(eid);
}

const heVersionList = heById("id-ver-list");
const heVLDName = "id-vld";
const heVLDCName = "id-vld-check";
const hePresetList = heById("id-preset-list");
const hePLDName = "id-pld-regex";
const heSearchPattern = heById("id-search-pattern");
const heResultList = heById("id-result-list");
var timerSearch = null;

function onInit() {
    ueVersions.forEach(uev => {
        uev.cvar.forEach(c => {
            c.help = c.help.replaceAll("\n", "<br>");
        });
    });
    ueVersions.forEach(e => {
        heVersionList.innerHTML +=
            `<div name="${heVLDName}">
                <input type="radio" name="${heVLDCName}">${e.display}
            </div>`;
    });
    heByName(heVLDName).forEach(he => {
        he.addEventListener("click", () => {
            he.querySelector('input[type="radio"]').checked = true;
            onStartSearch();
        });
    });
    heByName(heVLDCName)[0].checked = true;

    presetRegexes.forEach(e => {
        hePresetList.innerHTML +=
            `<div name="${hePLDName}" regex="${e.regex}">
                <li class="lv${e.lv}">${e.display}</li>
            </div>`;
    });
    heByName(hePLDName).forEach((he, he_i) => {
        he.addEventListener("click", () => {
            heSearchPattern.value = presetRegexes[he_i].regex;
            onStartSearch();
        });
    });

    heSearchPattern.addEventListener("input", () => {
        clearTimeout(timerSearch);
        timerSearch = setTimeout(onStartSearch, 500);
    });
}

function onStartSearch() {
    heResultList.innerHTML = "";

    var ue_version = ueVersions[0];
    heByName(heVLDCName).forEach((value, i) => {
        if (value.checked)
            ue_version = ueVersions[i];
    });

    var pattern = heSearchPattern.value.toLowerCase();
    var result = "";
    ue_version.cvar.forEach(e => {
        if (e.name.toLowerCase().match(pattern) ||
            e.help.toLowerCase().match(pattern))
            result += `<div>
                        <div>${e.type}</div>
                        <div>${e.name}</div>
                        <div>${e.help}</div>
                        </div>`;
    });

    if (result.length == 0) {
        result = `<div style="font-size: 3rem; line-height: 3rem;">🤔</div>`;
    }
    heResultList.innerHTML = result;
}

onInit();
onStartSearch();
