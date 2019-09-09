const tape = require("tape");
var phylotree_utils = require("../build/phylotree-utils.js");
// var phylotree_utils = require("../");
function concatArrayIds(acc, node) {
  acc.push(node.id);
  return acc;
}

function getBigTree() {
  const node7 = { id: 7 };
  const node2 = {
    id: 2,
    children: [
      {
        id: 3,
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
        id: 8,
        children: [
          {
            id: 6
          },
          node7
        ]
      }
    ]
  };
  const node13 = { id: 13 };
  return {
    id: 1,
    children: [
      node2,
      {
        id: 9,
        children: [
          {
            id: 10,
            children: [
              {
                id: 11
              },
              {
                id: 12
              }
            ]
          },
          node13
        ]
      }
    ]
  };
}

function getTestTree1() {
  return {
    children: [
      {
        children: [
          {
            children: [termNode("Roseo1"), termNode("Roseo2")]
          },
          termNode("Rhizo")
        ]
      },
      termNode("outgroup")
    ]
  };
}

function getTestTree2() {
  return {
    children: [
      {
        children: [termNode("Roseo1"), termNode("Roseo2")]
      },
      {
        children: [
          {
            children: [termNode("Rhizo"), termNode("Pseudo")]
          },
          termNode("outgroup")
        ]
      }
    ]
  };
}

tape("Tree post order traversal (eachAfter)", function(test) {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  var node_ids_traversal = [];
  phylotree_utils.utils().eachAfter(tree, function(node) {
    node_ids_traversal.push(node.id);
  });
  var traversal_signature = node_ids_traversal.join(";");
  test.equal(traversal_signature, "4;5;2;3;1");

  test.end();
});

tape("Tree pre order traversal (eachBefore)", function(test) {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  var node_ids_traversal = [];
  phylotree_utils.utils().eachBefore(tree, function(node) {
    node_ids_traversal.push(node.id);
  });
  var traversal_signature = node_ids_traversal.join(";");
  test.equal(traversal_signature, "1;2;4;5;3");

  test.end();
});

tape("Children accessor", function(test) {
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
  phylotree_utils.utils(childAcc).eachAfter(tree, function(node) {
    node_ids_traversal.push(node.id);
  });
  var traversal_signature = node_ids_traversal.join(";");
  test.equal(traversal_signature, "4;5;2;3;1");

  test.end();
});

tape("Test addParent function", function(test) {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  var node_ids_traversal = [];
  const TreeUtils = phylotree_utils.utils();
  TreeUtils.addParent(tree);
  TreeUtils.eachAfter(tree, function(node) {
    if (node.parent) {
      node_ids_traversal.push(node.id + "_" + node.parent.id);
    } else {
      node_ids_traversal.push(node.id + "_null");
    }
  });
  var traversal_signature = node_ids_traversal.join(";");
  test.equal(traversal_signature, "4_2;5_2;2_1;3_1;1_null");

  test.end();
});

tape("Test reduceAfter", function(test) {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  const TreeUtils = phylotree_utils.utils();

  var sumAccCb = function(acc, curr) {
    return acc + curr.id;
  };
  var sum = TreeUtils.reduceAfter(tree, sumAccCb, 0);
  test.equal(sum, 15);

  var concat = TreeUtils.reduceAfter(tree, sumAccCb, "");
  test.equal(concat, "45231");

  var array_concat = [];
  array_concat = TreeUtils.reduceAfter(tree, concatArrayIds, array_concat);
  test.deepEqual(array_concat, [4, 5, 2, 3, 1], array_concat);

  test.end();
});

tape("Test reduceBefore", function(test) {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  const TreeUtils = phylotree_utils.utils();

  var sumAccCb = function(acc, curr) {
    return acc + curr.id;
  };
  var sum = TreeUtils.reduceBefore(tree, sumAccCb, 0);
  test.equal(sum, 15);

  var concat = TreeUtils.reduceBefore(tree, sumAccCb, "");
  test.equal(concat, "12453");

  var array_concat = [];
  array_concat = TreeUtils.reduceBefore(tree, concatArrayIds, array_concat);
  test.deepEqual(array_concat, [1, 2, 4, 5, 3]);

  test.end();
});

tape("Test filter nodes", test => {
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, { id: 5 }] }, { id: 3 }]
  };
  const TreeUtils = phylotree_utils.utils();

  var res = TreeUtils.filter(tree, node => {
    return node.id < 3;
  }).map(node => {
    return node.id;
  });
  test.deepEqual(res, [1, 2]);

  var res2 = TreeUtils.filter(tree, node => {
    return node.id >= 3;
  }).map(node => {
    return node.id;
  });
  test.deepEqual(res2, [4, 5, 3]);

  test.end();
});

tape("Test each ancestor", test => {
  const node5 = { id: 5 };
  const node3 = { id: 3 };
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, node5] }, node3]
  };
  const TreeUtils = phylotree_utils.utils();
  TreeUtils.addParent(tree);
  var ancestor_record = [];
  TreeUtils.eachAncestor(node5, node => {
    ancestor_record.push(node.id);
  });

  test.deepEqual(ancestor_record, [5, 2, 1]);

  ancestor_record = [];
  TreeUtils.eachAncestor(node3, node => {
    ancestor_record.push(node.id);
  });
  test.deepEqual(ancestor_record, [3, 1]);

  test.end();
});

tape("Test reduce ancestor", test => {
  const node5 = { id: 5 };
  const node3 = { id: 3 };
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, node5] }, node3]
  };
  const TreeUtils = phylotree_utils.utils();
  TreeUtils.addParent(tree);

  const res = TreeUtils.reduceAncestor(
    node5,
    (acc, node) => {
      acc.push(node.id);
      return acc;
    },
    []
  );

  test.deepEqual(res, [5, 2, 1]);

  test.end();
});

tape("Test Filter ancestor", test => {
  const node5 = { id: 5 };
  const node3 = { id: 3 };
  var tree = {
    id: 1,
    children: [{ id: 2, children: [{ id: 4 }, node5] }, node3]
  };
  const TreeUtils = phylotree_utils.utils();
  TreeUtils.addParent(tree);
  const res = TreeUtils.filterAncestor(node5, node => {
    return node.id === 1;
  }).map(node => {
    return node.id;
  });

  test.deepEqual(res, [1]);

  // Get nextToLast
  const res2 = TreeUtils.filterAncestor(node5, parent => {
    if (parent.parent) {
      return parent.parent.parent == null;
    } else {
      return false;
    }
  }).map(node => {
    return node.id;
  });
  test.deepEqual(res2, [2]);

  const res3 = TreeUtils.filterAncestor(node3, parent => {
    if (parent.parent) {
      return parent.parent.parent == null;
    } else {
      return false;
    }
  }).map(node => {
    return node.id;
  });
  test.deepEqual(res3, [3]);

  test.end();
});

tape("Test getBigTree", test => {
  const TreeUtils = phylotree_utils.utils();

  const tree_a = getBigTree();
  const array_concat = TreeUtils.reduceBefore(tree_a, concatArrayIds, []);
  test.deepEqual(
    array_concat,
    [1, 2, 3, 4, 5, 8, 6, 7, 9, 10, 11, 12, 13],
    "Tree get the right topology"
  );

  test.end();
});

tape("Test root tree", test => {
  const TreeUtils = phylotree_utils.utils();

  // First test: root on node 7
  {
    const tree_a = getBigTree();
    const node7 = TreeUtils.filter(tree_a, node => node.id === 7)[0];
    test.equal(node7.id, 7, "Get the node 7");
    const new_root_7 = TreeUtils.rootTree(node7, tree_a);
    const array_concat_7 = TreeUtils.reduceBefore(
      new_root_7,
      concatArrayIds,
      []
    );
    test.deepEqual(
      array_concat_7,
      [1, 7, 8, 6, 2, 3, 4, 5, 9, 10, 11, 12, 13],
      "Root on the node 7 branch"
    );
  }

  // Second test: root on node 2
  {
    const tree_b = getBigTree();
    const node2 = TreeUtils.filter(tree_b, node => node.id === 2)[0];
    test.equal(node2.id, 2, "Get the node 2");
    const new_root_2 = TreeUtils.rootTree(node2, tree_b);
    const array_concat_2 = TreeUtils.reduceBefore(
      new_root_2,
      concatArrayIds,
      []
    );
    test.deepEqual(
      array_concat_2,
      [1, 2, 3, 4, 5, 8, 6, 7, 9, 10, 11, 12, 13],
      "Root on node 2 branch"
    );
  }

  // Third test: root on node 1 (i.e. no change)
  {
    const tree_c = getBigTree();
    const node1 = TreeUtils.filter(tree_c, node => node.id === 1)[0];
    test.equal(node1.id, 1, "Get the node 1");
    const new_root_1 = TreeUtils.rootTree(node1, tree_c);
    const array_concat_1 = TreeUtils.reduceBefore(
      new_root_1,
      concatArrayIds,
      []
    );
    test.deepEqual(
      array_concat_1,
      TreeUtils.reduceBefore(getBigTree(), concatArrayIds, []),
      "Root on node 1 branch"
    );
  }

  // Fourth test
  {
    const tree = getTestTree1();
    const outgroup = TreeUtils.filter(tree, node => node.id === "outgroup")[0];
    test.equal(outgroup.id, "outgroup", "Get the outgroup");
    const new_root = TreeUtils.rootTree(outgroup, tree);
    const empty_parent = TreeUtils.filter(new_root, node => {
      if (node.parent) {
        return node.parent == null;
      } else {
        return true;
      }
    });
    test.equal(empty_parent.length, 1, "No non-parent node inside tree");
  }

  // Fifth test
  {
    const tree = getTestTree2();
    const outgroup = TreeUtils.filter(tree, node => node.id === "outgroup")[0];
    test.equal(outgroup.id, "outgroup", "Get the outgroup");
    const new_root = TreeUtils.rootTree(outgroup, tree);
    const empty_parent = TreeUtils.filter(new_root, node => {
      if (node.parent) {
        return node.parent == null;
      } else {
        return true;
      }
    });
    test.equal(empty_parent.length, 1, "No non-parent node inside tree");
  }

  test.end();
});

tape("Test reduceAfterLeft", test => {
  const tree_a = getBigTree();
  const TreeUtils = phylotree_utils.utils();
  const left_node = TreeUtils.reduceAfterLeft(
    tree_a,
    function(acc, left) {
      if (!left.children) {
        return left;
      } else {
        return acc;
      }
    },
    null
  );
  test.deepEqual(left_node.id, 4, "Get the left node");

  test.end();
});

tape("Test reduceAfterRight", test => {
  const tree_a = getBigTree();
  const TreeUtils = phylotree_utils.utils();
  const node = TreeUtils.reduceAfterRight(
    tree_a,
    function(acc, child) {
      if (!child.children) {
        return child;
      } else {
        return acc;
      }
    },
    null
  );
  test.deepEqual(node.id, 13, "Get the left node");

  test.end();
});
