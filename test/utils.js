var tape  = require("tape");
var phylotree_utils = require("../");




tape("post order traversal tree", function(test){
    
    var tree = {
	id: 1,
	children: [
	    {
		id: 2,
		children: [
		    {
			id: 4
		    },
		    {
			id: 5
		    }
		]
	    },
	    {
		id: 3
	    }
	]
    };
    var node_ids_traversal = [];
    phylotree_utils
	.utils()
	.traverseTreePostOrder(tree,function(node){
	    node_ids_traversal.push(node.id);
	});
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"4;5;2;3;1");
    test.end();
});
tape("Chidlren accessor", function(test){

    var tree = {
	id: 1,
	childs: [
	    {
		id: 2,
		childs: [
		    {
			id: 4
		    },
		    {
			id: 5
		    }
		]
	    },
	    {
		id: 3
	    }
	]
    };
    var childAcc = function(node) {
	return node.childs;
    };
    
    var node_ids_traversal = [];
    phylotree_utils
	.utils(childAcc)
	.traverseTreePostOrder(tree,function(node){
	    node_ids_traversal.push(node.id);
	});
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"4;5;2;3;1");
    test.end();
});
