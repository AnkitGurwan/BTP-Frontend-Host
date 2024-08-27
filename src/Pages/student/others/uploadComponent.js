import React from 'react';
import Header from '../../../components/mainPagesHeader';


const handleFileChange = (e) => {
    // const { name, files } = e.target;
    // if (files && files[0]) {
    //     // Basic client-side validation for file size (e.g., 5MB max size)
    //     if (files[0].size > 5242880) {
    //         alert("File size should be less than 5MB");
    //         return;
    //     }
    //     setUserData({ ...userData, [name]: files[0] });
    // }
};
const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!auth.currentUser) {
    //     alert('No authenticated user found!');
    //     return;
    // }

    // const userId = auth.currentUser.uid;
    // try {
    //     // Upload Grade Card
    //     const gradeCardPath = userData.gradeCard ? 
    //         await uploadFileToFirebase(userData.gradeCard, `gradeCards/${userId}/${userData.gradeCard.name}`) : 
    //         null;
        
    //     // Upload CV if present
    //     const cvPath = userData.cv ? 
    //         await uploadFileToFirebase(userData.cv, `cvs/${userId}/${userData.cv.name}`) : 
    //         null;
        
    //     console.log('File paths:', { gradeCardPath, cvPath });

        
    //     alert('Upload successful');
    //     navigate('/btp/student/projects');
    // } catch (error) {
    //     console.error('Error uploading files:', error);
    //     alert('Error during upload. Please try again.');
    // }
};

const UploadComponent = () => {
    return(
        <div>
            <Header/> 

            <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Grade Card
                    </label>
                    <input
                        type="file"
                        name="gradeCard"
                        onChange={handleFileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload CV (Optional)
                    </label>
                    <input
                        type="file"
                        name="cv"
                        onChange={handleFileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm leading-4 font-medium text-gray-700"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Upload
                </button>
            </form>
        </div> 
        </div>
    )
}

export default UploadComponent;