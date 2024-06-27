import React from 'react';
import Footer from '../common/footer';
import ComplexNavbar from '../common/navbar';

function Refund() {
  return (
    <div>
    <ComplexNavbar />
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Refund Policy</h2>
      <div className="overflow-auto  max-w-full max-h-[90vh] rounded-lg shadow-md p-6">
        <p className="text-white leading-relaxed mb-4">
               Cancellation, Return, and Refund Policy</p>
            <p className="text-white  leading-relaxed mb-4">Effective Date: This policy is effective from the date a user registers on the website by filling out the registration form and accepting the terms and conditions.
            </p>
            <p className="text-white  leading-relaxed mb-4">Ownership: The Site is owned by Rainger Ventures Private Limited ("get to hire" or "the Company"). The Company may update this policy periodically.
            </p>
            <p className="text-white  leading-relaxed mb-4"> Cancellation and Return Policy
            </p>
            <p className="text-white  leading-relaxed mb-4">- Immediate Cancellation: Orders can be cancelled within 5 minutes of placement for a full refund, processed within 7 working days.
            </p>
            <p className="text-white  leading-relaxed mb-4"> Refund Policy
            </p>
            <p className="text-white  leading-relaxed mb-4">- Refund Processing: Refunds for eligible cancellations will be processed within 5 minutes after the returned items are received and verified. Refunds will be issued to the original payment method used.
            </p>
            <p className="text-white  leading-relaxed mb-4"> Third-Party Sales
            </p>
            <p className="text-white  leading-relaxed mb-4">- Third-Party Policies:Third-party sellers set their own cancellation, return, and refund policies. The Site and the Company are not responsible for third-party transactions. Check the third-party's policy before purchasing.
            </p>
            <p className="text-white  leading-relaxed mb-4">For further details or clarification, please contact us.
            </p>
                    </div>
    </div>
    <Footer />
  </div>
);
}

export default Refund;