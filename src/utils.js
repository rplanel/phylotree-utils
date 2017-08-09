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
    self.eachAfter = function(root, callback) {
	const cb = function(child){
	    self.eachAfter(child, callback);
	};
	loopChildren(root, cb);
	callback(root);
    };

    self.reduceAfter = function(node, callback, acc) {
	const cb = function(child){
	    acc = self.reduceAfter(child, callback, acc);
	};
	loopChildren(node, cb);
	return callback(acc, node);
    };

    

    self.eachBefore = function(node, callback) {
	const cb = function(child){
	    self.eachBefore(child, callback);
	};
	callback(node);
	loopChildren(node, cb);
    };
    
    
    
    
    /**
     *
     */
    self.addParent = function (root) {
	root.parent = null;
	const cb = function( node ){
	    const children = getChildren(node);
	    if (children) {
		children.forEach(function(child){
		    child.parent = node;
		});
	    }
	};
	self.eachAfter(root, cb);
    };
    
    return self;
}
