import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS, VENDOR_ADDRESS } from "@/constants";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

function FullPaymentPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInsuranceChecked, setIsInsuranceChecked] = useState(false); // Initially unchecked
  const [isTermsChecked, setIsTermsChecked] = useState(false); // Initially unchecked

  const navigate = useNavigate(); // Initialize navigate for navigation

  const merchandiseSubtotal = 100.0;
  const deliveryFee = 20.0;
  const insuranceFee = 10.0;

  const totalCost = merchandiseSubtotal + deliveryFee + insuranceFee;
  const handInPrice = totalCost;

  const handlePaymentClick = async () => {
    if (isInsuranceChecked && isTermsChecked) {
      // Do payment transaction
      if (!account) return [];

      try {
        const transaction: InputTransactionData = {
          data: {
            function: `${MODULE_ADDRESS}::payment::handle_payment`,
            functionArguments: ["75000", VENDOR_ADDRESS],
          },
        };

        // Sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // Wait for transaction
        await aptos.waitForTransaction({ transactionHash: response.hash });
        setIsDialogOpen(true);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      alert("Please agree to the insurance and terms & conditions to proceed.");
    }
  };

  const handleContinueClick = () => {
    setIsDialogOpen(false);
    navigate("/vendors"); // Redirect to the VendorPage after successful payment
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="bg-white rounded-lg shadow-md p-8 pb-28">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button className="text-2xl mr-4">&larr;</button>
          <h1 className="text-2xl font-semibold">Payment</h1>
        </div>

        {/* Product Information Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
          <img
            src="/images/yacht2.jpg"
            alt="Delivery Illustration"
            width={244.67}
            height={186.45}
            className="h-48 rounded-md mb-4"
          />
          <div className="ml-0 md:ml-8 mt-4 md:mt-0">
            <h3 className="text-2xl font-semibold">Yatch</h3>
            <span className="text-red-500 text-lg font-medium">50% OFF</span>
            <p className="text-gray-400 text-lg line-through">Before $200</p>
            <p className="text-cyan-600 text-2xl font-bold">Now $100</p>
          </div>
        </div>

        {/* Description Section */}
        <p className="text-gray-800 text-lg font-medium mb-2">Description</p>
        <p className="text-gray-600 text-lg mb-8">
          An engaging guide to mastering technology for the modern entrepreneur.
        </p>

        {/* Gray Bar */}
        <div className="bg-gray-200 h-[19px] w-full mb-6"></div>

        {/* Delivery Information Section */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-7 h-7 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 10H7M21 6H7m14 8H7m14 4H7m0 4H3m4-16H3m0 4H3m0 4H3m0 4H3m0 4H3m4-16H3m4 0H7"
                />
              </svg>
              <p className="ml-3 text-gray-600 text-lg">Delivered by 18 - 21 Aug 2024</p>
            </div>
            <p className="text-gray-600 text-lg">$20.00</p>
          </div>

          {/* Gray Bar */}
          <div className="bg-gray-200 h-[19px] w-full"></div>

          {/* Insurance Section */}
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={isInsuranceChecked}
                onChange={(e) => setIsInsuranceChecked(e.target.checked)}
              />
              <span className="ml-3 text-gray-600 text-lg">Insurance (10% product cost)</span>
            </label>
            <p className="text-gray-600 text-lg">$10.00</p>
          </div>

          {/* Gray Bar */}
          <div className="bg-gray-200 h-[19px] w-full"></div>

          {/* Terms & Condition Section */}
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
              <span className="ml-3 text-gray-600 text-lg">Terms & Condition</span>
            </label>
          </div>
        </div>

        {/* Final Payment Section */}
        <div className="bg-gray-200 h-[19px] w-full mb-6"></div>
        <div className="space-y-4 text-right text-gray-600">
          <div className="flex justify-between text-lg">
            <p>Merchandise Subtotal:</p>
            <p>${merchandiseSubtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg">
            <p>Delivery Fee:</p>
            <p>${deliveryFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg">
            <p>Insurance:</p>
            <p>${insuranceFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold text-xl">
            <p>Total Cost:</p>
            <p className="text-orange-500">${totalCost.toFixed(2)}</p>
          </div>

          <div className="flex justify-between text-lg">
            <p>Hand-in Price:</p>
            <p className="text-teal-600 font-semibold">${handInPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Button */}
        <button
          className={`bg-black text-white font-bold py-3 px-6 rounded-lg absolute bottom-16 right-16 ${!isInsuranceChecked || !isTermsChecked ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handlePaymentClick}
          disabled={!isInsuranceChecked || !isTermsChecked}
        >
          Payment
        </button>

        {/* Payment Successful Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 text-center space-y-6 shadow-lg">
              <h2 className="text-2xl font-semibold">Payment Successful</h2>
              <p className="text-green-500 text-3xl">&#10003;</p>
              <button className="bg-black text-white font-bold py-2 px-4 rounded-lg" onClick={handleContinueClick}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FullPaymentPage;
