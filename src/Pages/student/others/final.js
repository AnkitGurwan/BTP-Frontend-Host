import React, { useContext, useEffect, useState } from 'react';
import Header from '../../../components/mainPagesHeader';
import fire from '../../../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkmark } from 'react-checkmark'
import StudentContext from '../../../context/student/StudentContext';
import AuthContext from '../../../context/auth/AuthContext';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UploadComponent = () => {

    const { uploadDoc } = useContext(StudentContext);
    const { getUserDetailsFromMicrosoft, StudentMicrosoftLogin } = useContext(AuthContext);

    const [uploadSignedCopy, setUploadSignedCopy] = useState("");
    const [checkDoc, setCheckDoc] = useState(false);
    
    const [allowed, setAllowed] = useState(true);
    const [random, setRandom] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const navigate = useNavigate();

    const studentInfo = useSelector((state) => state.student.studentInfo);

    const getItem = async () => {
        const x = await getUserDetailsFromMicrosoft();

        if ( x === 409 || x === 410)
        {
            await StudentMicrosoftLogin();
        }

        setRandom(true);
    }
    useEffect(() => {
        getItem();
    },[random])

    const handleGrade = (e) => {
        e.preventDefault();

        if(uploadSignedCopy === "")
        {
            toast.error("No grade card Selected", {
                position: 'top-center'
            });
            return;
        }
        
        setLoading1(true);
        
        const uploadFileRef = fire.storage().ref(`uploads/signedcopy/${ uploadSignedCopy.name}`);
        
        uploadFileRef.put(uploadSignedCopy).on("state_changed", (snapshot) => {
            const progress = Math.round(
            (snapshot.bytesTransferred/ snapshot.totalBytes) * 100
            );
        },
        (error)=>{
            console.log(error)
        },
            async () => {
                const fileData = await uploadFileRef.getDownloadURL();

                if(!studentInfo || !studentInfo.studInfo)
                {
                    await StudentMicrosoftLogin();
                    return;
                }
                
                const email = studentInfo.studInfo.mail;

                setCheckDoc(true);

                const x = await uploadDoc(email, fileData);
                if(x === 200)
                {
                    setUploadSignedCopy("");
                    toast.success("Grade Card Uploaded Successfully", {
                        position: 'top-center'
                    });
                }
                else
                {
                    setUploadSignedCopy("");
                    toast.error("Couldn't upload at the moment.", {
                        position: 'top-center'
                    });
                }
                setLoading1(false);
                });
    }

    const download = async (e) => {
        e.preventDefault();
        
        window.open(``,'_blank');
    }

    return(
        <div>
            <Header/> 
                {allowed
                ?
                <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow">
                    <div className="space-y-4">
                        <div
                            className="w-fit flex items-center border rounded-md"
                        >
                            <div
                            className="text-xs md:text-sm p-2 border-r"
                            >
                            Download document ( Kindly fill all the information and upload it below )
                            </div>
                            <i
                            className="fa-solid fa-download text-2xl px-4"
                            onClick={download}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                            ></i>
                        </div>
                        <div className='pt-4'>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Grade Card
                            </label>
                            <div className='flex gap-2 pt-2 items-center'>
                                {checkDoc
                                ?
                                <input
                                    type="file"
                                    name="gradeCard"
                                    disabled
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                    required
                                />
                                :
                                <input
                                    type="file"
                                    name="gradeCard"
                                    onChange={(e) => {setUploadSignedCopy(e.target.files[0])}}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                                    required
                                />}
                                {loading1
                                ?
                                <div className="w-1/4 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                                :
                                checkDoc
                                ?
                                <div className='w-1/4 flex items-center'>
                                    <Checkmark size='24px' color='green' />
                                </div>
                                :
                                <button
                                    onClick={handleGrade}
                                    className="w-1/4 flex justify-center h-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Upload
                                </button>}
                            </div>
                        </div>
                        
                        <Link
                            to="/btp/student/projects"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue
                        </Link>
                    </div>   
                </div> 
                :
                <div className="w-full flex justify-center mt-8 md:mt-20">
                    <div className="max-w-md bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold mb-4">404</h1>
                        <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for could not be accessed by you.</p>
                        <div className="bg-blue-500 text-center text-white text-xl font-bold py-2 px-4 rounded">
                            You are not part of this Course.
                        </div>
                    </div>
                </div>}
            </div>
    )
}

export default UploadComponent;