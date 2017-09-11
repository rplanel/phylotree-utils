// rollup.config.js
export default {
    input: "index.js",
    output: {
	file  : "build/phylotree-utils.js",
	format: "es",
	name  : "phylotree-utils"
    }
    // globals: {
    // 	"d3": "d3",
    // 	"phylotree-utils": "PhyloUtils"
    // },
    // external: ["d3", "phylotree-utils", "PhyloUtils"]
};
