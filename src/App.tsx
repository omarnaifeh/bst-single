import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

class Node {
  value: number;
  left: Node | null = null;
  right: Node | null = null;
  parent: Node | null = null;

  constructor(value: number, parent: Node | null = null) {
    this.value = value;
    this.parent = parent;
  }
}

class BinarySearchTree {
  root: Node | null = null;

  insert(value: number) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          newNode.parent = current;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          newNode.parent = current;
          return;
        }
        current = current.right;
      }
    }
  }

  getTree(): Node | null {
    return this.root;
  }
}

const TreeNode: React.FC<{
  node: Node | null;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
  highlightNode?: Node | null;
  foundNode?: Node | null;
}> = ({ node, x, y, parentX, parentY, highlightNode, foundNode }) => {
  if (!node) return null;

  const radius = 20;
  const dx = x - (parentX || 0);
  const dy = y - (parentY || 0);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / distance) * radius;
  const offsetY = (dy / distance) * radius;

  const isFound = node === foundNode;
  const isHighlighted = node === highlightNode;

  return (
    <>
      {parentX !== undefined && parentY !== undefined && (
        <motion.line
          x1={parentX + offsetX}
          y1={parentY + offsetY}
          x2={x - offsetX}
          y2={y - offsetY}
          stroke="black"
          strokeWidth="2"
        />
      )}
      <motion.circle
        cx={x}
        cy={y}
        r={radius}
        fill={isFound ? "green" : isHighlighted ? "orange" : "#4A90E2"}
        stroke="white"
        strokeWidth="2"
      />
      <motion.text
        x={x}
        y={y}
        textAnchor="middle"
        fill="white"
        dy=".3em"
        className="font-bold text-xs"
      >
        {node.value}
      </motion.text>
      <TreeNode node={node.left} x={x - 50} y={y + 50} parentX={x} parentY={y} highlightNode={highlightNode} foundNode={foundNode} />
      <TreeNode node={node.right} x={x + 50} y={y + 50} parentX={x} parentY={y} highlightNode={highlightNode} foundNode={foundNode} />
    </>
  );
};

const App: React.FC = () => {
  const [tree, setTree] = useState<BinarySearchTree>(new BinarySearchTree());
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [foundNode, setFoundNode] = useState<Node | null>(null);

  const onInsert = () => {
    const num = parseInt(value);
    if (isNaN(num)) return alert("Indtast venligst et tal");

    const newTree = Object.create(Object.getPrototypeOf(tree), Object.getOwnPropertyDescriptors(tree));
    newTree.insert(num);
    setTree(newTree);
    setValue("");
    setCurrentNode(null);
    setTarget(null);
    setFoundNode(null);
  };

  const onStartSearch = () => {
    const num = parseInt(searchValue);
    if (isNaN(num)) return alert("Indtast tal du vil søge efter");
    setCurrentNode(tree.getTree());
    setTarget(num);
    setFoundNode(null);
  };

  const onNextStep = () => {
    if (!currentNode || target === null) return;

    if (currentNode.value === target) {
      setFoundNode(currentNode);
      setCurrentNode(null);
      return;
    }

    const next = target < currentNode.value ? currentNode.left : currentNode.right;

    if (!next) {
      alert(`Tallet ${target} findes ikke i træet.`);
      setCurrentNode(null);
      return;
    }

    setCurrentNode(next);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Binært Søgetræ Visualisering</h1>
      <div className="flex gap-4 items-center mb-4">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Indsæt tal"
          className="border rounded p-2"
        />
        <button onClick={onInsert} className="bg-blue-500 text-white rounded px-4 py-2">Indsæt</button>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Søg tal"
          className="border rounded p-2"
        />
        <button onClick={onStartSearch} className="bg-green-500 text-white rounded px-4 py-2">Start Søgning</button>
        <button onClick={onNextStep} className="bg-yellow-500 text-white rounded px-4 py-2">Næste Trin</button>
      </div>

      <svg className="bg-gray-100 rounded shadow-lg" width="800" height="500">
        <TreeNode
          node={tree.getTree()}
          x={400}
          y={50}
          highlightNode={currentNode}
          foundNode={foundNode}
        />
      </svg>
    </div>
  );
};

export default App;