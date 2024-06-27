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
                  Terms and Conditions For Candidate
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <ol className="list-decimal ml-4">
                      <li>Registration fees rs.199 is applicable for accessing and utilizing our get to hire manpower consultancy portal.</li>
                      <li>Accurate Information: Candidates are responsible for providing accurate and truthful information during the registration process. Any falsification may result in disqualification.</li>
                      <li>Payment Confirmation: Registration is considered complete only upon successful payment confirmation. Incomplete or pending payments may lead to the suspension of access.</li>
                      <li>Validity Period: 45 days</li>
                      <li>Platform serves as a bridge for candidates and potential employers to engage with each other. While we facilitate connections, it's important to note that the ultimate hiring decisions rest with the employers.</li>
                      <li>Privacy and Data Security: Candidate information is handled with utmost confidentiality. We employ industry-standard security measures to protect personal data. However, candidates are advised to be cautious about sharing sensitive information.</li>
                      <li>Code of Conduct: Candidates are expected to adhere to a code of conduct, treating fellow users and employers with respect. Any form of harassment or inappropriate behavior may lead to account suspension.</li>
                      <li>Communication Channels: Official communication regarding job opportunities and portal updates will be conveyed through designated channels. Candidates should regularly check their registered email and portal notifications.</li>
                      <li>Refund Policy: The registration fee is non-refundable. In case of technical errors or issues, candidates should reach out to our customer support for resolution.</li>
                      <li>Termination of Services: We reserve the right to terminate a candidate's access to the portal in the case of a violation of terms and conditions or any misuse of the platform. The decision of termination rests with the portal administrators.</li>
                    </ol>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
        Close
      </button>
       
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
