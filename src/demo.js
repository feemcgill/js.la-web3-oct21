import { ethers } from 'ethers'

const contract_address = '0x7152d10611051f14abae43daf3632d7a3d63a164'

const contract_abi = [
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function balanceOf(address owner) view returns (uint256)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mintItem() payable returns (uint256)',
  'function name() view returns (string)',
  'function owner() view returns (address)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function renounceOwnership()',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)',
  'function setApprovalForAll(address operator, bool approved)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 id) view returns (string)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function transferOwnership(address newOwner)',
]

let provider, signer, contract

const connect = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  signer = provider.getSigner()
  contract = new ethers.Contract(contract_address, contract_abi, provider)

  await provider.send('eth_requestAccounts', [])
  const bal = await contract.balanceOf(signer.getAddress())
  if (bal.toNumber() > 0) {
    dom_show_gated()
  } else {
    dom_show_register()
  }

  return true
}

const mint = async () => {
  const val = {
    value: ethers.utils.parseEther('0.001'),
  }
  const contractWithSigner = await contract.connect(signer)
  const obj = {}
  obj.mint = await contractWithSigner.mintItem(val)
  obj.tx = obj.mint.hash
  obj.transaction = await provider.waitForTransaction(obj.tx)
  dom_show_gated()
  return obj
}

function dom_show_register() {}

function dom_show_gated() {}

/* 






















*/
connect()
mint()
