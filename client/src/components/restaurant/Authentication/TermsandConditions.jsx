import React from 'react';

const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null; // Don't render anything if isOpen is false
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Heroicon name: outline/exclamation */}
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17h.01" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Terms and Conditions for Restaurants
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    HIRE CANDIDATES
                    <ol className="list-decimal ml-4">
                      <li>Registration Fee: A one-time registration fee of Rs. 1,999 is applicable per restaurant. This fee grants unlimited job postings and access to additional dashboard benefits.</li>
                      <li>Commission Structure: A service fee equivalent to 5% of the candidate's total annual salary is charged. Payment is divided into two parts: 25% of the total recruitment cost is required upfront to initiate the hiring process, with the remaining 75% due upon successful candidate placement.</li>
                      <li>Code of Conduct: Registered entities must uphold a professional and respectful demeanor in all interactions with candidates and other users. Any instances of misconduct may result in the suspension of the account.</li>
                      <li>Communication Channels: Official correspondence, including candidate profiles and recruitment updates, will be communicated through designated channels. It is advisable for registered users to regularly check their registered emails and portal notifications for important updates.</li>
                      <li>Refund Policy: The registration fee of Rs. 1,999 is non-refundable. However, 25% of the advance payment for recruitment (initiated upfront) is refundable in the event of recruitment failure within 30 days.</li>
                      <li>Privacy Policy: Information provided during the registration process is treated with strict confidentiality. We employ robust security measures to safeguard sensitive data. Registrants are advised to exercise caution when sharing proprietary information.</li>
                      <li>Termination of Services: We reserve the right to terminate an entity's access to the portal in case of a violation of terms and conditions or misuse of the platform. Decisions regarding termination rest with the portal administration.</li>
                    </ol>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
        Close
      </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
