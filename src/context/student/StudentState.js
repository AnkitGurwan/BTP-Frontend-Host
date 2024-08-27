import React, {useState} from "react";
import StudentContext from "./StudentContext";
import { setAllStudents, setPartnerRequestsRedux, setSentRequestsRedux } from "../../Redux/student/studentSlice"
import { useDispatch } from "react-redux";
var _ = require('lodash');


const StudentState = (props) => {

    const dispatch = useDispatch();

    //local backend url for testing
    const url = process.env.REACT_APP_BACKEND_URL;

    //hosted backend url
    // const url = process.env.REACT_APP_BACKEND_URL;


    //check student is alloted project or not
    const checkStudentAlloted = async ( userEmail ) => {
        const response = await fetch(`${url}/student/checkAlloted/${userEmail}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        const json = await response.json();

        //if alloted return response status and id of the project registered
        var array = [];
        array.push(response.status);
        array.push(json.id);
        
        return array;
    }


    //create a new student
    const createStudent = async (userEmail, userName, userRoll) => {
        const response = await fetch(`${url}/student/newstudent`, {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, userName, userRoll})
        });
        const json = await response.json();
        
        return response.status;
    };

    const addPartner = async ( student, partner ) => {
        const response = await fetch(`${url}/student/partner/${student}/${partner}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        
        return response.status;
    };

    const finalPartner = async ( student, partner ) => {
        const response = await fetch(`${url}/student/finalpartner/${student}/${partner}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        
        return response.status;
    };

    const partnerRequest = async (email) => {
        const response = await fetch(`${url}/student/partnerrequest/${email}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        const json = await response.json();


        //save details in react state and redux
        dispatch(setPartnerRequestsRedux(json));

        return response.status;
    };

    const sentRequest = async (email) => {
        const response = await fetch(`${url}/student/sentrequest/${email}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
        });
        const json = await response.json();


        //save details in react state and redux
        dispatch(setSentRequestsRedux(json));

        return response.status;
    };

    const findStepDone = async ( email ) => {
        const response = await fetch(`${url}/student/stepsdone/find/${email}`,{
            method: 'GET',
            credentials:'include',
            headers: { 
                'Context-Type': 'application/json'
            }
        })
        const json = await response.json();
        return json.ans;
    }

    const increaseStepDone = async ( email ) => {
        const response = await fetch(`${url}/student/stepsdone/increase/${email}`,{
            method: 'GET',
            credentials:'include',
            headers: { 
                'Context-Type': 'application/json'
            }
        })

        return response.status;
    }


    const getAllStudent = async ()=>{     
        const response = await fetch(`${url}/student/allstudents`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': "application/json"
            }
            })   
        const json=await response.json()
        dispatch(setAllStudents(json));
        
       return json;
    };
    

    const LogOut = async () => {
        const response = await fetch(`${url}/auth/microsoft/logout`,{
            method: 'GET',
            credentials:'include',
            headers: { 
                'Context-Type': 'application/json'
            }
        })

        const tenantID = process.env.MICROSOFT_GRAPH_TENANT_ID;
        const logoutEndpoint = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.REACT_APP_FRONTEND_URL}`;
        window.location.href = logoutEndpoint;
    }

    const checkStudentEligible = ( roll ) => {
        if (
            `${process.env.REACT_APP_ROLL_LOW}` <= roll &&
            roll <= `${process.env.REACT_APP_ROLL_HIGH}`
        ) {
            return true;
        } 
        else {
            return false;
        }
    }

    //send feedback
    const sendFeedback = async (email, header,body)=>{
        const response = await fetch(`${url}/user/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, header, body }),
        });
        
        return response.status;
    }
    
        
    return (
        <StudentContext.Provider value={{LogOut,createStudent, addPartner, finalPartner, partnerRequest, sentRequest, checkStudentAlloted, findStepDone, increaseStepDone, checkStudentEligible, sendFeedback, getAllStudent}}>
            {props.children}
        </StudentContext.Provider>
    )
}

export default StudentState;