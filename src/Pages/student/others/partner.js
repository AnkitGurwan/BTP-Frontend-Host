import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StudentContext from '../../../context/student/StudentContext';
import AuthContext from '../../../context/auth/AuthContext';

const AddPartnerPage = () => {
    const { addPartner, partnerRequest, sentRequest, finalPartner } = useContext(StudentContext);
    const { getUserDetailsFromMicrosoft } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [random, setRandom] = useState(false);

    const pendingRequests = useSelector((state) => state.student.sentRequests);
    const studentInfo = useSelector((state) => state.student.studentInfo);
    const upcomingRequests = useSelector((state) => state.student.partnerRequests);

    useEffect(() => {
        const fetchData = async () => {
            await getUserDetailsFromMicrosoft();
            if (studentInfo?.studInfo) {
                await partnerRequest(studentInfo.studInfo.mail);
                await sentRequest(studentInfo.studInfo.mail);
            }
            setRandom(true);
        };
        fetchData();
    }, [random, getUserDetailsFromMicrosoft, partnerRequest, sentRequest, studentInfo]);

    const handleAddPartner = async (e) => {
        e.preventDefault();
        if (studentInfo?.studInfo) {
            if (studentInfo.studInfo.mail === email) {
                toast.error('You have entered your own email.', { position: 'top-center' });
                return;
            }
            const responseCode = await addPartner(studentInfo.studInfo.mail, email);
            handleResponse(responseCode);
        }
    };

    const handleAcceptRequest = async (request) => {
        if (studentInfo?.studInfo) {
            const responseCode = await finalPartner(studentInfo.studInfo.mail, request);
            handleResponse(responseCode);
        }
    };

    const handleResponse = (responseCode) => {
        const messages = {
            200: 'Operation successful',
            401: 'Student not logged in',
            402: "Partner id doesn't exist",
            403: 'You already have a partner',
            404: 'Partner already has a partner',
        };

        const message = messages[responseCode] || 'Server error. Contact admin.';
        responseCode === 200
            ? toast.success(message, { position: 'top-center' })
            : toast.error(message, { position: 'top-center' });

        if (responseCode === 200) {
            navigate('/btp/student/projects');
        }
    };

    const handleBack = () => navigate('/btp/student/projects');

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6 sm:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
                <h3
                    className="w-fit text-lg md:text-xl font-medium text-blue-600 border border-blue-600 rounded-lg p-3 mb-6 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                    onClick={handleBack}
                >
                    Return Home
                </h3>
                <h2 className="text-2xl font-semibold text-gray-800 mb-8">Add Project Partner</h2>

                <form
                    className="flex flex-col sm:flex-row items-center"
                    onSubmit={handleAddPartner}
                >
                    <input
                        type="email"
                        autoFocus
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Partner's email"
                        className="form-input px-4 py-3 border border-gray-300 rounded-lg w-full sm:flex-1 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                    <button
                        className="mt-4 sm:mt-0 sm:ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto transition-all"
                        type="submit"
                    >
                        Send Request
                    </button>
                </form>

                <div className="mt-10">
                    <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
                        <div className="w-full sm:w-1/2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Received Requests</h3>
                            <ul className="space-y-4">
                                {upcomingRequests.map((request, i) => (
                                    <li key={i} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                                        <span className="text-gray-700">{request}</span>
                                        <button
                                            onClick={() => handleAcceptRequest(request)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                                        >
                                            Accept
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sent Requests</h3>
                            <ul className="space-y-4">
                                {pendingRequests.map((request, i) => (
                                    <li key={i} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                        <span className="text-gray-700">{request}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPartnerPage;