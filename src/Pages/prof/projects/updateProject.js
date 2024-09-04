import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import ProjectContext from '../../../context/project/ProjectContext';
import ProfContext from '../../../context/prof/ProfContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AuthContext from "../../../context/auth/AuthContext";
import MainPagesHeader from "../../../components/mainPagesHeaderProf";

const NewProject = () => {
    const { updateProject, Projectspecific } = useContext(ProjectContext);
    const { ProfMicrosoftLogin } = useContext(AuthContext);
    const { getProfDetailsFromMicrosoft, checkProfEligible } = useContext(ProfContext);

    const [allowed, setAllowed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [random, setRandom] = useState(false);
    const [itemData, setItemData] = useState({
        title: '',
        abstract: '',
        cosupervisor: '',
        specialization: ''
    });

    const items = useSelector(state => state.allProjects.specificProjects);
    const profInfo = useSelector(state => state.prof.profInfo);

    // Check if prof is allowed or not to access the page
    const checkAllowed = async () => {
        const x = await getProfDetailsFromMicrosoft();

        if (x === 200) {
            if (profInfo && profInfo.profInfo) {
                const job = profInfo.profInfo.jobTitle || "student";
                const roll = profInfo.profInfo.surname || "340103016";

                if (checkProfEligible(job, roll)) {
                    setAllowed(true);
                } else {
                    setAllowed(false);
                }
            } else {
                setAllowed(false);
            }
            setLoading(false);
            setRandom(true);
        } else {
            await ProfMicrosoftLogin();
        }
    };

    const getItem = async () => {
        checkAllowed();
        await Projectspecific();
    }

    useEffect(() => {
        getItem();
        getProject();
    }, [random]);

    const params = useParams();
    const id = params.id;

    const getProject = () => {
        const project = items.length && items.filter(project => project._id === id);

        if (project && project.length > 0) {
            const selectedProject = project[0];
            setItemData({
                title: selectedProject.title,
                abstract: selectedProject.brief_abstract,
                cosupervisor: selectedProject.co_supervisor,
                specialization: selectedProject.specialization
            });
        }
    }

    const onChangeHandler = (e) => {
        setItemData({ ...itemData, [e.target.name]: e.target.value });
    }

    const navigate = useNavigate();
    const submit = async (e) => {
        e.preventDefault();

        if (profInfo && profInfo.profInfo) {
            await updateProject(itemData.title, itemData.abstract, itemData.cosupervisor, itemData.specialization, id, profInfo.profInfo.mail);
            toast.success('Updated successfully', {
                position: 'top-center'
            });
            navigate('/btp/prof/owner/projects');
        }
    }

    return (
        <div className="w-full font-sans">
            <MainPagesHeader />
            <div className="flex p-4">
                <Link className='text-blue-500 hover:text-blue-700' to={`/btp/prof/owner/projects`}>
                    <i className="fa-sharp fa-solid fa-arrow-left fa-2xl" />
                </Link>
                <div className="text-2xl flex justify-start items-center font-bold mx-auto gap-2 pr-8">
                    <span className="material-symbols-outlined text-3xl">edit_note</span>
                    <div className="border-b-2 border-gray-300 px-2">Update Project</div>
                </div>
            </div>
            <form
                className="w-4/5 md:w-3/4 mx-auto shadow-xl rounded-lg px-8 py-4 mb-2 mt-4 bg-gray-100 border-4 border-gray-300"
                onSubmit={submit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
                            Project Title:
                        </label>
                        <input
                            className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 text-sm md:text-md leading-tight focus:outline-none"
                            id="title"
                            type="text"
                            placeholder="Enter project title"
                            name="title"
                            autoFocus
                            onChange={onChangeHandler}
                            value={itemData.title}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="abstract">
                            Brief Abstract:
                        </label>
                        <textarea
                            id="abstract"
                            rows="5"
                            className="block w-full text-gray-700 text-sm md:text-md bg-gray-50 rounded-lg border-2 border-gray-300 px-3 py-2 focus:outline-none"
                            placeholder="Write project details..."
                            name="abstract"
                            onChange={onChangeHandler}
                            value={itemData.abstract}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="cosupervisor">
                            Co-Supervisor:
                        </label>
                        <input
                            className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 text-sm md:text-md leading-tight focus:outline-none"
                            id="cosupervisor"
                            type="text"
                            placeholder="Name of Co-Supervisor"
                            name="cosupervisor"
                            onChange={onChangeHandler}
                            value={itemData.cosupervisor}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="specialization">
                            Specialization:
                        </label>
                        <input
                            className="appearance-none border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 text-sm md:text-md leading-tight focus:outline-none"
                            id="specialization"
                            type="text"
                            placeholder="Enter the specialization"
                            name="specialization"
                            onChange={onChangeHandler}
                            value={itemData.specialization}
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold text-lg py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewProject;