export default function (children) {
    
    let self = {};
    
    /* Private attributes */
    const getChildren = (children == null) ? defaultChildren : children;
    
    // PRIVATE FUNCTION
    function defaultChildren(d) {
	return d.children;
    }
    
    function loopChildren(node, callback) {
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
	loopChildren(node, child => {
	    self.eachAfter(child, callback);
	});
	callback(node);
    };
    
    self.reduceAfter = function (node, callback, acc) {
	loopChildren(node, child => {
	    acc = self.reduceAfter(child, callback, acc);
	});
	return callback(acc, node);
    };
    
    

    self.eachBefore = function(node, callback) {
	const cb = function(child){
	    self.eachBefore(child, callback);
	};
	callback(node);
	loopChildren(node, cb);
    };
    
    self.reduceBefore = function(node, callback, acc) {
	const cb = function(child){
	    acc = self.reduceBefore(child, callback, acc);
	};
	acc = callback(acc, node);
	loopChildren(node, cb);
	return acc;
    };
    
    
    self.filter = function () {
	
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
	    loopChildren(node, cb_set_parent);
	};
	self.eachAfter(node, cb);
    };
    
    return self;
}
