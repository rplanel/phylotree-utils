var tape  = require("tape");
var phylotree_utils = require("../");

tape("Tree post order traversal (eachAfter)", function(test){
    var tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, {id: 5} ]}, {id: 3}]};
    var node_ids_traversal = [];
    phylotree_utils
	.utils()
	.eachAfter(tree,function(node){
	    node_ids_traversal.push(node.id);
	});
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"4;5;2;3;1");
    test.end();
});
tape("Tree pre order traversal (eachBefore)", function(test){
    var tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, {id: 5} ]}, {id: 3}]};
    var node_ids_traversal = [];
    phylotree_utils
	.utils()
	.eachBefore(tree,function(node){
	    node_ids_traversal.push(node.id);
	});
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"1;2;4;5;3");
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
	.eachAfter(tree,function(node){
	    node_ids_traversal.push(node.id);
	});
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"4;5;2;3;1");
    test.end();
});
tape("Test addParent function",function(test){
    var tree = {id:1,children:[{id: 2,children: [{id: 4},{id:5}]},{id:3}]};
    var node_ids_traversal = [];
    const TreeUtils = phylotree_utils.utils();
    TreeUtils.addParent(tree);
    TreeUtils.eachAfter(tree,function(node){
	if (node.parent) {
	    node_ids_traversal.push(node.id+"_"+node.parent.id);
	}
	else {
	    node_ids_traversal.push(node.id+"_null");
	}
    });
    var traversal_signature = node_ids_traversal.join(";");
    test.equal(traversal_signature,"4_2;5_2;2_1;3_1;1_null");
    test.end();
});
tape("Test reduceAfter", function(test){
    var tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, {id: 5} ]}, {id: 3}]};
    const TreeUtils = phylotree_utils.utils();
    
    var sumAccCb = function(acc, curr) {
	return acc + curr.id;
    };
    var sum = TreeUtils.reduceAfter(tree, sumAccCb, 0);
    test.equal(sum,15);

    var concat = TreeUtils.reduceAfter(tree, sumAccCb, "");
    test.equal(concat,"45231");
    
    var concat_array_ids = function(acc, node) {
	acc.push(node.id);
	return acc;
    };
    var array_concat = [];
    array_concat = TreeUtils.reduceAfter(tree, concat_array_ids, array_concat);
    test.deepEqual(array_concat, [4, 5, 2, 3, 1], array_concat);


    
    test.end();
    
    
});
tape("Test reduceBefore", function(test){
    var tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, {id: 5} ]}, {id: 3}]};
    const TreeUtils = phylotree_utils.utils();
    
    var sumAccCb = function(acc, curr) {
	return acc + curr.id;
    };
    var sum = TreeUtils.reduceBefore(tree, sumAccCb, 0);
    test.equal(sum,15);

    var concat = TreeUtils.reduceBefore(tree, sumAccCb, "");
    test.equal(concat,"12453");
    
    var concat_array_ids = function(acc, node) {
	acc.push(node.id);
	return acc;
    };
    var array_concat = [];
    array_concat = TreeUtils.reduceBefore(tree, concat_array_ids, array_concat);
    test.deepEqual(array_concat, [1, 2, 4, 5, 3]);
    test.end();
    
    
});
tape("Test filter nodes",(test) => {

    var tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, {id: 5} ]}, {id: 3}]};
    const TreeUtils = phylotree_utils.utils();
    
    var res = TreeUtils.filter(tree, (node ) => {
	return node.id < 3;
    }).map((node) => {
	return node.id;
    });
    test.deepEqual(res, [1, 2]);

    var res2 = TreeUtils.filter(tree, (node ) => {
	return node.id >= 3;
    }).map((node) => {
	return node.id;
    });
    test.deepEqual(res2, [4, 5, 3]);
    test.end();
    
});

tape("Test each ancestor",(test) => {


    const node5 = {id:5};
    const node3 = {id:3};
    var   tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, node5 ]}, node3]};
    const TreeUtils = phylotree_utils.utils();
    TreeUtils.addParent(tree);
    var ancestor_record = [];
    TreeUtils.eachAncestor(node5, (node) => {
	ancestor_record.push(node.id);
    });
    
    test.deepEqual(ancestor_record, [5,2,1]);

    ancestor_record = [];
    TreeUtils.eachAncestor(node3, (node) => {
	ancestor_record.push(node.id);
    });
    test.deepEqual(ancestor_record, [3,1]);
    
    test.end();
    
});


tape("Test reduce ancestor",(test) => {
    
    
    const node5 = {id:5};
    const node3 = {id:3};
    var   tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, node5 ]}, node3]};
    const TreeUtils = phylotree_utils.utils();
    TreeUtils.addParent(tree);

    const res = TreeUtils.reduceAncestor(node5, (acc, node) => {
	acc.push(node.id);
	return acc;
    }, []);
    
    test.deepEqual(res, [5,2,1]);
    
    test.end();
    
});


tape("Test Filter ancestor",(test) => {
    const node5 = {id:5};
    const node3 = {id:3};
    var   tree = {id: 1, children: [ {id: 2,children: [ {id: 4}, node5 ]}, node3]};
    const TreeUtils = phylotree_utils.utils();
    TreeUtils.addParent(tree);
    const res = TreeUtils.filterAncestor(node5, (node) => {
    	return node.id === 1;
    }).map((node) => {
    	return node.id;
    });
    
    test.deepEqual(res, [1]);
    
    
    // Get nextToLast
    const res2 = TreeUtils.filterAncestor(node5, (parent) => {
	if (parent.parent) {
	    return parent.parent.parent == null;
	}
	else {
	    return false;
	}
    }).map((node) => {
	return node.id;
    });
    test.deepEqual(res2, [2]);


    const res3 = TreeUtils.filterAncestor(node3, (parent) => {
	if (parent.parent) {
	    return parent.parent.parent == null;
	}
	else {
	    return false;
	}
    }).map((node) => {
	return node.id;
    });
    test.deepEqual(res3, [3]);
    
    test.end();
    
});
