export const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "projects",
    outputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "user",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "currentAmount",
        type: "uint256",
      },
      {
        name: "maxAmount",
        type: "uint256",
      },
      {
        name: "currentPeople",
        type: "uint256",
      },
      {
        name: "maxPeople",
        type: "uint256",
      },
      {
        name: "status",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_maxAmount",
        type: "uint256",
      },
      {
        name: "_maxPeople",
        type: "uint256",
      },
    ],
    name: "add",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "projectLength",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "closeProject",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_pid",
        type: "uint256",
      },
    ],
    name: "contribution",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "maxAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "maxPeople",
        type: "uint256",
      },
    ],
    name: "NewProject",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NewContribution",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "pid",
        type: "uint256",
      },
    ],
    name: "CloseProject",
    type: "event",
  },
];
