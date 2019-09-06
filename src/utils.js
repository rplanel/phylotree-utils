export default function (children) {

	var self = {};

	/* Private attributes */
	var getChildren = (children == null) ? defaultChildren : children;

	// PRIVATE FUNCTION
	function defaultChildren(node) {
		return node.children;
	}

	function forParent(node, callback) {
		var parent = node.parent;
		if (parent) {
			callback(parent);
		}
	}

	function forLeftChildren(node, callback) {
		var children = getChildren(node);
		if (children) {
			callback(children[0]);
		}
	}

	function forRightChildren(node, callback) {
		var children = getChildren(node);
		if (children) {
			callback(children[children.length - 1]);
		}
	}

	function forEachChildren(node, callback) {
		var children = getChildren(node);
		if (children) {
			children.forEach(callback);
		}
	}

	function switchParentChild(node, child) {
		// check if child is one of the children's node.
		if (node.children) {
			var indexChild = node.children.findIndex(function (el) {
				return el === child;
			});
			if (indexChild !== -1) { // the futur parent is currently the children
				// check if child if the node's parent
				if (node.parent) {
					var parent = node.parent;
					node.parent = child;
					var newChildren = node.children.slice(0, indexChild).concat(
						node.children.slice(indexChild + 1)
					);
					newChildren.push(parent);
					node.children = newChildren;
					switchParentChild(parent, node);
				}
			}
			else {
				//throw("The child is not the children of the current node");
			}
		}
		else {
			return;
		}
	}

	// PUBLIC FUNCTION
    /**
     * Invokes the specified function for node and each descendant in post-order traversal, 
     * such that a given node is only visited after all of its descendants have already been visited.
     */
	self.eachAfter = function (node, callback) {
		forEachChildren(node, function (child) {
			self.eachAfter(child, callback);
		});
		callback(node);
	};

	self.reduceAfter = function (node, callback, acc) {
		forEachChildren(node, function (child) {
			acc = self.reduceAfter(child, callback, acc);
		});
		return callback(acc, node);
	};

	self.eachBefore = function (node, callback) {
		callback(node);
		forEachChildren(node, function (child) {
			self.eachBefore(child, callback);
		});
	};

	self.reduceBefore = function (node, callback, acc) {
		acc = callback(acc, node);
		forEachChildren(node, function (child) {
			acc = self.reduceBefore(child, callback, acc);
		});
		return acc;
	};

	self.filter = function (node, callback) {
		return self.reduceBefore(node, function (acc, node) {
			if (callback(node)) {
				acc.push(node);
			}
			return acc;
		}, []);
	};

	self.eachAncestor = function (node, callback) {
		callback(node);
		forParent(node, function (parent) {
			self.eachAncestor(parent, callback);
		});
	};

	self.reduceAncestor = function (node, callback, acc) {
		acc = callback(acc, node);
		forParent(node, function (parent) {
			acc = self.reduceAncestor(parent, callback, acc);
		});
		return acc;
	};

	self.filterAncestor = function (node, callback) {
		return self.reduceAncestor(node, function (acc, parent) {
			if (callback(parent)) {
				acc.push(parent);
				return acc;
			}
			else {
				return acc;
			}
		}, []);
	};

	// self.eachAfterLeft = function(node, callback) {
	// 	forLeftChildren(node, function(left_child) {
	// 	    self.eachAfterLeft(left_child, callback);
	// 	});
	// 	callback(node);
	// };

	self.reduceAfterLeft = function (node, callback, acc) {
		forLeftChildren(node, function (left_child) {
			acc = self.reduceAfterLeft(left_child, callback, acc);
		});
		return callback(acc, node);
	};

	self.reduceAfterRight = function (node, callback, acc) {
		forRightChildren(node, function (right_child) {
			acc = self.reduceAfterRight(right_child, callback, acc);
		});
		return callback(acc, node);
	};

    /**
     *
     */
	self.addParent = function (node) {
		if (!node.parent) {
			node.parent = null;
		}
		var cb = function (node) {
			var cb_set_parent = function (child) {
				child.parent = node;
			};
			forEachChildren(node, cb_set_parent);
		};
		self.eachAfter(node, cb);
	};

	self.rootTree = function (new_root, tree) {
		// Add parent attribute
		self.addParent(tree);

		if (new_root.parent === null) {
			return tree;
		}
		else {
			// get the next to last node before the current root
			var next_to_last_list = self.filterAncestor(new_root, function (node) {
				if (node.parent) {
					return node.parent.parent == null;
				}
				else {
					return false;
				}
			});

			if (next_to_last_list.length === 1) {
				var next_to_last = next_to_last_list[0];

				// get sibling of this next_to_last node
				var next_to_last_sibling = tree.children.find(function (elem) {
					return next_to_last !== elem;
				});

				// Set next_to_lastSibling has parent of next_to_last.
				next_to_last_sibling.parent = null;
				next_to_last.parent = next_to_last_sibling;

				// Remove outgroup as 

				// 2. traverse the tree from the new root and modify topology.
				var new_root_node = { id: tree.id, children: [new_root, new_root.parent] };

				// Remove new_root as child of his parent.
				var new_root_child_index = new_root.parent.children.findIndex(function (el) {
					return el === new_root;
				});

				if (new_root_child_index !== -1) {
					new_root.parent.children[new_root_child_index] = new_root_node;
				}
				else {
				}
				switchParentChild(new_root.parent, new_root_node);
				new_root.parent = new_root_node;
				return new_root_node;
			}
			else {
				throw {
					message: "Error while getting next to last ancestor",
					name: "ExceptionNextToLastAncestor"

				};
				// return tree;
			}
		}
	};

	return self;
}
