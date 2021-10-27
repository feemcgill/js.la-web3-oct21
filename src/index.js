import 'regenerator-runtime/runtime'
import { ethers } from 'ethers'

const dom_mint_button = document.getElementById('mint-one')
const dom_connect_button = document.getElementById('connect-button')
const dom_signer = document.getElementById('signer')
const dom_register = document.getElementById('register')
const dom_registered = document.getElementById('registered')
const dom_user = document.getElementById('user')
const dom_status = document.getElementById('status')

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
    dom_show_registered()
  } else {
    dom_show_register()
  }
  dom_connect_button.style.display = 'none'
  dom_user.style.display = 'block'
  dom_signer.innerHTML = await signer.getAddress()
}

const mint = async () => {
  dom_mint_button.style.display = 'none'
  dom_status.innerHTML = 'Registering pass'
  const obj = {}
  const val = {
    value: ethers.utils.parseEther('0.001'),
  }
  const contractWithSigner = await contract.connect(signer)
  obj.mint = await contractWithSigner.mintItem(val)
  dom_status.innerHTML = 'Transaction processing... <img src="assets/pab_dolph.gif">'
  obj.tx = obj.mint.hash
  obj.transaction = await provider.waitForTransaction(obj.tx)
  obj.token_id = parseInt(Number(obj.transaction.logs[0].topics[3]))
  obj.uri = await contract.tokenURI(obj.token_id)
  dom_show_registered()
  return obj
}

/** 
Dom stuff
**/
dom_mint_button.addEventListener('click', function () {
  mint().then((data) => {
    console.log('minted!', data)
  })
})

dom_connect_button.addEventListener('click', function () {
  connect()
})

function dom_show_register() {
  dom_register.style.display = 'flex'
}

function dom_show_registered() {
  dom_registered.style.display = 'block'
  dom_register.style.display = 'none'
}
