if ((typeof swan !== 'undefined') && (typeof swanGlobal !== 'undefined')) {
	require("swan-game-adapter.js");
	require("libs/laya.bdmini.js");
} else if (typeof wx!=="undefined") {
	require("weapp-adapter.js");
	require("libs/min/laya-d6d8a092e4.wxmini.min.js");
}
window.loadLib = require;
require("index-c410d44549.js");