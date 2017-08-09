export default function (children) {
    
    let self = {};
    
    /* Private attributes */
    const getChildren = (children == null) ? defaultChildren : children;
    
    // PRIVATE FUNCTION
    function defaultChildren(d) {
	return d.children;
    }
    
    // PUBLIC FUNCTION
    /**
     * 
     */
    self.traverseTreePostOrder = function(root, callback) {
	const children = getChildren(root);
	if (children) {
	    children.forEach(function(child){
		self.traverseTreePostOrder(child, callback);
	    });
	}
	callback(root);
    };
    
    /**
     *
     */
    self.addParent = function (root) {
	root.parent = null;
	var cb = function( node ){
	    const children = getChildren(node);
	    if (children) {
		children.forEach(function(child){
		    child.parent = node;
		});
	    }
	};
	self.traverseTreePostOrder(root, cb);
    };
    
    return self;
}
