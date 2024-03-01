class Board {
    constructor(size) {
        this.size = size;
        this.board = this.setBoard();
        this.moves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
    }

    setBoard() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }

    knightMoves(start, end) {
        const node = new Node(start);
        let visited = [node.value];
        let paths = [];
        this.recursiveF(start, end, node, visited, paths);
        return paths;
    }

    recursiveF(start, end, node, visited, paths) {
        if (start === end) {
            return;
        }
        let queue = [node];
        while (queue.length > 0) {
            const currNode = queue.shift();
            if (paths.length === 0 || currNode.depth < paths[0].length -1) {
                const [x, y] = currNode.value;
                const moves = this.moves.map(move => [x + move[0], y + move[1]]);
                moves.forEach((moveNode) => {
                    const [nextX, nextY] = moveNode;             
                    const [endX, endY] = end;
                    const allowedMove = nextX >= 0 && nextX < this.size && nextY >= 0 && nextY < this.size;
                    const visitedMove = visited.some(([visitedX, visitedY]) => visitedX === nextX && visitedY === nextY);
                    const newNode = new Node([nextX, nextY], currNode, currNode.depth + 1);
    
                    if (nextX === endX && nextY === endY) {
                        if (paths[0] && paths[0].length < 3) {
                            return;
                        }
                        paths.push(this.getPath(newNode));
                        const node = new Node(start);
                        queue = [node];
                        visited = [];
                        for (let i = 0; i < paths.length; i++) {
                            for (let j = 0; j < paths[i].length; j++) {
                                    visited.push(paths[i][j]);
                            }
                        }
                        this.recursiveF(start, end, node, visited, paths);
                        return;
                    } else if (allowedMove && !visitedMove) {
                        currNode.conns.push(newNode);
                        visited.push(newNode.value);
                        queue.push(newNode);
                    }
                });
            }
        }
    }

    printPaths(paths) {
        const solutions = paths.length;
        const moves = paths[0].length - 1;

        console.log(`> knightMoves([${paths[0][0]}], [${paths[0][paths[0].length - 1]}])
        => You made it in ${moves} moves! Found ${solutions} solution${solutions > 1 ? 's' : ''}. Here are your paths:`);
        paths.forEach((path, index) => {
            console.log(`         path ${index + 1}: ${JSON.stringify(path)}`);
        });
    }

    getPath(node) {
        const path = [];
    
        while(node !== null) {
            path.push(node.value);
            node = node.parent;
        }

        return path.reverse();
    }
}

class Node {
    constructor(value, parent = null, depth = 0) {
        this.value = value;
        this.parent = parent;
        this.conns = [];
        this.depth = depth;
    }
}

export { Board, Node };

