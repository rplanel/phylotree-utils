export default function (children) {
    
    var self = {};
    

    /* Private attributes */
    const children_acc = (children == null) ? defaultChildren : children;
    
    
    /********************/
    /* PRIVATE FUNCTION */
    /********************/
    function defaultChildren(d) {
	return d.children;
    }
    
    
    /*******************/
    /* PUBLIC FUNCTION */
    /*******************/
    self.traverseTreePostOrder = function(root, callback) {
	const children = children_acc(root);
	if (children) {
	    children.forEach(function(child){
		self.traverseTreePostOrder(child, callback);
	    });
	}
	callback(root);
    };
    return self;
}
