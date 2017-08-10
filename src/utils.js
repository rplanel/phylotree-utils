export default function (children) {
    
    let self = {};
    
    /* Private attributes */
    const getChildren = (children == null) ? defaultChildren : children;
    
    // PRIVATE FUNCTION
    function defaultChildren(node) {
	return node.children;
    }


    function forParent(node, callback) {
	if (node.parent) {
	    callback(node.parent);
	}
    }
    
    function forEachChildren(node, callback) {
	const children = getChildren(node);
	if (children) {
	    children.forEach(callback);
	}
    }
    
    // PUBLIC FUNCTION
    /**
     * Invokes the specified function for node and each descendant in post-order traversal, 
     * such that a given node is only visited after all of its descendants have already been visited.
     */
    self.eachAfter = function(node, callback) {
	forEachChildren(node, child => {
	    self.eachAfter(child, callback);
	});
	callback(node);
    };
    
    self.reduceAfter = function (node, callback, acc) {
	forEachChildren(node, child => {
	    acc = self.reduceAfter(child, callback, acc);
	});
	return callback(acc, node);
    };
    
    
    self.eachBefore = function(node, callback) {
	callback(node);
	forEachChildren(node, (child) => {
	    self.eachBefore(child, callback);
	});
    };
    
    self.reduceBefore = function(node, callback, acc) {
	acc = callback(acc, node);
	forEachChildren(node, (child) => {
	    acc = self.reduceBefore(child, callback, acc);
	});
	return acc;
    };
    
    self.filter = function (node, callback) {
	return self.reduceBefore(node, (acc, node) => {
	    if (callback(node)) {
		acc.push(node);
	    }
	    return acc;
	}, []);
    };
    
    self.eachAncestor = function (node, callback) {
	forParent(node, (parent) => {
	    callback(parent);
	    self.eachAncestor(parent, callback);
	});
    };
    
    self.reduceAncestor = function (node, callback, acc) {
	forParent(node, (parent) => {
	    acc = callback(acc, parent);
	    acc = self.reduceAncestor(parent, callback, acc);


	});
	return acc;
    };
    
    self.filterAncestor = function(node, callback) {
	return self.reduceAncestor(node, (acc, parent) => {
	    if (callback(parent)) {
		acc.push(parent);
		return acc;
	    }
	    else {
		return acc;
	    }
	}, []);
    };

    
    /**
     *
     */
    self.addParent = function (node) {
	if (!node.parent) {
	    node.parent = null;
	}
	const cb = function( node ){
	    const cb_set_parent = function(child) {
		child.parent = node;
	    };
	    forEachChildren(node, cb_set_parent);
	};
	self.eachAfter(node, cb);
    };

    
    return self;
}
