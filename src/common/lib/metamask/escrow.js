import store from "@/store"
import { sendTransaction } from "./wallet"
import { queryOrderDetailByOrderID } from "@debionetwork/polkadot-provider"


/**
 * checkAllowance
 * 
 * check amount of DAI token allowance in the Escrow contract
 * 
 * @param {string} userAddress 
 * @returns string
 */
export async function checkAllowance(userAddress) {
  const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"]
  const escrowAddress = process.env.VUE_APP_DEBIO_ESCROW_ETH_ADDRESS
  let balance = await contractERC20Interface.methods
    .allowance(userAddress, escrowAddress).call()
  const web3 = store.getters["metamask/getWeb3"]
  return web3.utils.fromWei(balance, "ether")
}



/**
 * approveDaiStakingAmount
 * 
 * Before sending payment, user must approve
 * that the staking amount of DAI will be transfered 
 * by the escrow contract
 * 
 * @param {string} stakerAddress
 * @param {string | number} stakingAmount
 */
export async function approveDaiStakingAmount(stakerAddress, stakingAmount) {
  const contractERC20Interface = store.getters["metamask/contracts/getERC20InterfaceContract"]
  const escrowAddress = process.env.VUE_APP_DEBIO_ESCROW_ETH_ADDRESS
  const web3 = store.getters["metamask/getWeb3"]
  const txData = contractERC20Interface.methods.approve(
    escrowAddress,
    web3.utils.toWei(String(stakingAmount), "ether") // Convert to 18 decimal places
  ).encodeABI()

  const txHash = await sendTransaction(
    process.env.VUE_APP_DEBIO_DAI_TOKEN_ADDRESS,
    txData,
    stakerAddress
  )

  return txHash
}


/**
 * payOrder
 * 
 * Send a payment order to Escrow contract
 * 
 * @param {string} orderId
 * @param {string} serviceId
 * @param {string} customerSubstrateAddress
 * @param {string} sellerSubstrateAddress
 * @param {string} customerEthAddress
 * @param {string} sellerEthAddress
 * @param {string} dnaSampleTrackingId
 * @param {string | number} testingPrice
 * @param {string | number} qcPrice 
 * @param {string | number} payAmount
 * @returns
 * 
 */

export async function sendPaymentOrder(api, orderId, ethAccount, sellerEth) {
  const contracEscrowInterface = store.getters["metamask/contracts/getEscrowContract"]
  const currentData = await queryOrderDetailByOrderID(api, orderId)
  const serviceId = currentData.serviceId
  const customerSubstrateAddress = currentData.customerId
  const sellerSubstrateAddress = currentData.sellerId
  const customerEthAddress = ethAccount
  const sellerEthAddress = sellerEth
  const dnaSampleTrackingId = currentData.dnaSampleTrackingId
  const testingPrice = (currentData.prices[0].value).replaceAll(",", "")
  const qcPrice = (currentData.additionalPrices[0].value).replaceAll(",", "")
  const payAmount = Number(testingPrice) + Number(qcPrice)
  const escrowAddress = process.env.VUE_APP_DEBIO_ESCROW_ETH_ADDRESS


  const txData = contracEscrowInterface.methods
    .payOrder(
      orderId,
      serviceId,
      customerSubstrateAddress,
      sellerSubstrateAddress,
      customerEthAddress,
      sellerEthAddress,
      dnaSampleTrackingId,
      testingPrice,
      qcPrice,
      String(payAmount)
    )
    .encodeABI()

  const txHash = await sendTransaction(
    escrowAddress,
    txData,
    ethAccount
  )
  
  return txHash
}
