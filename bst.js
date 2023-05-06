const Node = (data, left = null, right = null) => ({
    data,
    left,
    right,
});

const Tree = (arr) => {
    const newArray = arr
        .sort((a, b) => a - b)
        .filter((value, index, array) => {
            if (value !== arr[index + 1]) return value;
        });
    /* eslint no-shadow: "error" */
    const buildTree = (arr) => {
        let root = null;
        if (arr.length > 1) {
            const mid = Math.floor(arr.length / 2);
            root = Node(arr[mid]);
            root.left = buildTree(arr.slice(0, mid));
            root.right = buildTree(arr.slice(mid + 1));
        }
        if (arr.length === 1) {
            root = Node(...arr);
        }
        return root;
    };

    let rootNode = buildTree(newArray);
    let rootTraverse = rootNode;
    let rootTraverseBefore = null;
    let direction = null;

    const insertValue = (value) => {
        if (value === rootTraverse.data) return;
        if (value < rootTraverse.data) {
            if (rootTraverse.left !== null || rootTraverse.right !== null)
                rootTraverse = rootTraverse.left;

            if (rootTraverse.left === null && value < rootTraverse.data) {
                rootTraverse.left = Node(value);
                return;
            }

            if (rootTraverse.right === null && value > rootTraverse.data) {
                rootTraverse.right = Node(value);
                return;
            }
            insertValue(value);
        } else {
            if (rootTraverse.left !== null || rootTraverse.right !== null)
                rootTraverse = rootTraverse.right;

            if (rootTraverse.left === null && value < rootTraverse.data) {
                rootTraverse.left = Node(value);
                return;
            }

            if (rootTraverse.right === null && value > rootTraverse.data) {
                rootTraverse.right = Node(value);
                return;
            }
            insertValue(value);
        }
        rootTraverse = rootNode;
    };

    const deleteValue = (value) => {
        rootTraverse = rootNode;
        const initialMatch = { ...find(value) };
        let deleteMatch = { ...initialMatch };

        // Value is a leaf node
        if (deleteMatch.left === null && deleteMatch.right === null)
            rootTraverseBefore[direction] = null;
        // Value has two child
        if (deleteMatch.left !== null && deleteMatch.right !== null) {
            let rightPath = deleteMatch.right;
            let depthFound = null;

            while (rightPath.left !== null) {
                rootTraverseBefore = rightPath;
                rightPath = rightPath.left;
                depthFound = rightPath;
            }

            rootTraverseBefore.left = null;

            depthFound.left = deleteMatch.left;
            depthFound.right = deleteMatch.right;
            deleteMatch = depthFound;
        } else {
            // Value has one child
            const isLeft = deleteMatch.left;
            const isRight = deleteMatch.right;
            if (isLeft) rootTraverseBefore[direction] = isLeft;
            if (isRight) rootTraverseBefore[direction] = isRight;
        }

        if (initialMatch !== rootNode) rootTraverse = rootNode;
        if (initialMatch.data === rootNode.data) rootNode = deleteMatch;

        return 'Not found';
    };

    const find = (value) => {
        if (rootTraverse) {
            rootTraverseBefore = rootTraverse;

            if (value === rootTraverse.data) return rootTraverse;

            if (value < rootTraverse.data) {
                direction = 'left';
                rootTraverse = rootTraverse.left;
            }

            if (value > rootTraverse.data) {
                direction = 'right';
                rootTraverse = rootTraverse.right;
            }

            return find(value);
        }
        return rootTraverse || 'Not found';
    };

    const levelOrder = (fn) => {
        if (rootTraverse === null) return;

        const queue = [rootTraverse];
        const arrResult = [];

        while (rootTraverse) {
            queue.shift();

            if (rootTraverse.left !== null) queue.push(rootTraverse.left);
            if (rootTraverse.right !== null) queue.push(rootTraverse.right);

            if (fn) {
                arrResult.push(fn(rootTraverse.data));
            } else {
                arrResult.push(rootTraverse.data);
            }
            rootTraverse = queue[0];
        }

        rootTraverse = rootNode;

        return arrResult;
    };

    const inorder = (fn) => {
        const array = [];

        const inorderTraversal = (node) => {
            if (node === null) return;
            inorderTraversal(node.left);
            if (fn) {
                array.push(fn(node.data));
            } else {
                array.push(node.data);
            }
            inorderTraversal(node.right);
        };

        inorderTraversal(rootTraverse);

        rootTraverse = rootNode;

        return array;
    };

    const preorder = (fn) => {
        const array = [];

        const preorderTraversal = (node) => {
            if (node === null) return;
            if (fn) {
                array.push(fn(node.data));
            } else {
                array.push(node.data);
            }
            preorderTraversal(node.left);
            preorderTraversal(node.right);
        };

        preorderTraversal(rootTraverse);

        rootTraverse = rootNode;

        return array;
    };

    const postorder = (fn) => {
        const array = [];

        const postorderTraversal = (node) => {
            if (node === null) return;
            postorderTraversal(node.left);
            postorderTraversal(node.right);
            if (fn) {
                array.push(fn(node.data));
            } else {
                array.push(node.data);
            }
        };

        postorderTraversal(rootTraverse);

        rootTraverse = rootNode;

        return array;
    };

    const height = (node) => {
        if (node == null) return -1;
        const leftHeight = height(node.left);
        const rightHeight = height(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    };

    const depth = (rootNode, node) => {
        if (rootNode === null) return -1;

        let dist = -1;

        if (rootNode.data === node) {
            return dist + 1;
        }

        dist = depth(rootNode.left, node);
        if (dist >= 0) return dist + 1;
        dist = depth(rootNode.right, node);
        if (dist >= 0) return dist + 1;

        return dist;
    };

    const isBalanced = () => {
        const heightLeft = height(rootNode.left);
        const heightRight = height(rootNode.right);

        if (Math.abs(heightLeft - heightRight) <= 1) return true;
        return false;
    };

    const rebalance = () => {
        const newArray = inorder();
        const newRootNode = buildTree(newArray);
        rootNode = newRootNode;
    };

    const getRootNode = () => rootNode;

    return {
        insertValue,
        deleteValue,
        find,
        levelOrder,
        inorder,
        preorder,
        postorder,
        getRootNode,
        height,
        depth,
        isBalanced,
        rebalance,
    };
};

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
};

// Test

// 1.Create a binary search tree from an array of random numbers. You  can create
// a function that returns an array of random numbers every time you call it, if you wish.

const generateRandomArray = (length, min, max) => {
    const arr = [];
    for (let i = 0; i < length; i += 1) {
        const randomValue = Math.floor(Math.random() * (max - min + 1) + min);
        arr.push(randomValue);
    }
    return arr;
};

const arrTest = generateRandomArray(50, 1, 1000);
const treeAlgorithm = Tree(arrTest);

// 2.Confirm that the tree is balanced by calling isBalanced

console.log(treeAlgorithm.isBalanced());

// 3. Print out all elements in level, pre, post, and in order
console.log(treeAlgorithm.levelOrder());
console.log(treeAlgorithm.preorder());
console.log(treeAlgorithm.postorder());
console.log(treeAlgorithm.inorder());

// 4. Unbalance the tree by adding several numbers > 100

const arrHundred = generateRandomArray(100, 1, 1000);
arrHundred.forEach((value) => {
    treeAlgorithm.insertValue(value);
});
console.log(prettyPrint(treeAlgorithm.getRootNode()));

// 5. Confirm that the tree is unbalanced by calling isBalanced
console.log(treeAlgorithm.isBalanced());

// 6. Balance the tree by calling rebalance
console.log(treeAlgorithm.rebalance());
console.log(prettyPrint(treeAlgorithm.getRootNode()));

// 7. Confirm that the tree is balanced by calling isBalanced
console.log(treeAlgorithm.isBalanced());

// 8. Print out all elements in level, pre, post, and in order
console.log(treeAlgorithm.levelOrder());
console.log(treeAlgorithm.preorder());
console.log(treeAlgorithm.postorder());
console.log(treeAlgorithm.inorder());