import ServiceProviderPage from "../serviceprovider/ServiceProviderPage";
import HiringCard from "./HiringCard";
import { Link} from "react-router-dom";
import './CareersPage.css';

function CareersPage() {

    return (
        <>
            <div className="text-center">
                <h1 className="mt-5">Grow With Us, Build What Matters.<i className="fa-regular fa-heart fa-fade fa-xs"></i></h1>
                <p>Be part of a team creating better experiences for customers and professionals.</p>
            </div>
            <HiringCard
                position={"Technician"}
                salary={"Earn upto ₹5 LPA"}
            />
            <HiringCard
                position={"Appliance Repair"}
                salary={"Earn upto ₹6 LPA"}
            />
            <HiringCard
                position={"Salon"}
                salary={"Earn upto ₹4 LPA"}
            />
            <HiringCard
                position={"Cleaning"}
                salary={"Earn upto ₹3 LPA"}
            />
            <HiringCard
                position={"Plumbing"}
                salary={"Earn upto ₹3.5 LPA"}
            />
            <HiringCard
                position={"Pest Control"}
                salary={"Earn upto ₹2 LPA"}
            />
            <HiringCard
                position={"Tiles Style"}
                salary={"Earn upto ₹8 LPA"}
            />
            <HiringCard
                position={"Interior Designer"}
                salary={"Earn upto ₹10 LPA"}
            />
<div className="d-flex justify-content-center mt-5">
    <Link to="/provider" className="career-link">
        <button className="career-btn">
            <span className="career-spark">✦</span>
            <span>Build Your Career with HomiGo</span>
            <span className="career-arrow">↗</span>
        </button>
    </Link>
</div>
        </>
    );
}

export default CareersPage;